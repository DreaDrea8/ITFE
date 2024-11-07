import jwt from 'jsonwebtoken'
import { Request, Response } from "express"
import { validationResult } from "express-validator"

import ERRORS from "@src/commons/Error"
import { Link } from "@src/entities/Link"
import { File } from "@src/entities/File"
import { Service } from "@src/services/service"
import { Reference } from "@src/entities/Reference"
import { jsonContent } from "@src/types/jsonContent"
import { User, userRoleEnum } from "@src/entities/User"
import { Repository } from "@src/repositories/Repository"
import { selectFileDtoInterface } from '@src/repositories/FileRepository'
import { insertLinkDtoInterface } from "@src/repositories/LinkRepository"
import { API_HOST, API_PROTOCOL, API_SHARE_URL_LIVE_TIME, JWT_EXPIRATION, JWT_SECRET } from "@src/commons/config"


export class CreateLink {
  repository: Repository
  service: Service

  constructor(repository: Repository, service: Service) {
    this.repository = repository
    this.service = service
  }

  execute = async (req: Request, res: Response) =>{
    try {
      const curentUser: User | undefined = req.user 
      if(!curentUser){
        throw new Error(ERRORS.CURRENT_USER_NOT_FOUND)
      }

      const error = validationResult(req)
      if (!error.isEmpty()) {
        const result: jsonContent = {
          message: 'Invalid request',
          data: null,
          error: error
        }
        res.status(400).json(result)
        return
      }

      const fileId: number = Number(req.body.file_id)
      let getFileDto: selectFileDtoInterface = {id: Number(fileId), userId: curentUser.id}
      if(curentUser.role === userRoleEnum.ADMINISTRATOR){
        getFileDto = {id: Number(req.params.file_id)}
      }
      const file: File|null = await this.repository.fileRepository.selectFile(getFileDto)
      if(!file){
        const result: jsonContent = {
          message: 'Invalid request',
          data: null,
          error: this.service.formatError(error, ERRORS.CREATE_LINK_CONTROLLER_FAIL_FILE_NOT_FOUND)
        }
        res.status(404).json(result)
        return
      }
      const references: Reference|null = await this.repository.referenceRepository.selectReference({id: file.referenceId})
      if(!references){
        const result: jsonContent = {
          message: 'Invalid request',
          data: null,
          error: this.service.formatError(error, ERRORS.CREATE_LINK_CONTROLLER_FAIL_REFERENCE_NOT_FOUND)
        }
        res.status(404).json(result)
        return
      }

      const defaultExpiration_date = new Date(new Date().getTime() + API_SHARE_URL_LIVE_TIME)  

      const addLinkDto : insertLinkDtoInterface = {
        userId: curentUser.id,
        fileId: fileId,
        revokedAt: req.body.expiration_date? new Date(req.body.expiration_date): defaultExpiration_date
      }

      const link: Link = await this.repository.linkRepository.insertLink(addLinkDto)

      const payload = { 
        link: link.id,
        file: file.id
      }
      const token: string = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
      const url: string = `${API_PROTOCOL}://${API_HOST}/api/download?token=${encodeURIComponent(token)}`
      const data = {
        link: link, 
        url: url
      }

      const result:jsonContent = {
        message: "Resource successfully created",
        data: data, 
        error: null
      }
      res.status(201).json(result)  
         
    } catch (error: any) {
      this.service.loggerService.error(ERRORS.CREATE_LINK_CONTROLLER_FAIL)
      const result: jsonContent = {
        message: "General server error",
        data: null,
        error: this.service.formatError(error, ERRORS.CREATE_LINK_CONTROLLER_FAIL)
      }
      res.status(500).json(result)
    }
  }
}

