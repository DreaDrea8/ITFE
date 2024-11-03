import jwt from 'jsonwebtoken'
import { Request, Response } from "express"
import { validationResult } from "express-validator"

import ERRORS from "@src/commons/Error"
import { User, userExemple, userRoleEnum } from "@src/entities/User"
import { getFileDtoInterface, removeFileDtoInterface } from "@src/repositories/FileRepository"
import { Repository } from "@src/repositories/Repository"
import { Service } from "@src/services/service"
import { jsonContent } from "@src/types/jsonContent"
import { addLinkDtoInterface } from "@src/repositories/LinkRepository"
import { Link } from "@src/entities/Link"
import { Reference } from "@src/entities/Reference"
import { File } from "@src/entities/File"
import { API_HOST, API_PORT, API_PROTOCOL, API_URL_LIVE_TIME, JWT_EXPIRATION, JWT_SECRET } from "@src/commons/config"



export class CreateLink {
  repository: Repository
  service: Service

  constructor(repository: Repository, service: Service) {
    this.repository = repository
    this.service = service
  }

  execute = async (req: Request, res: Response) =>{
    try {
      const curentUser: User = userExemple //TODO auth
      const valid = validationResult(req)
      if (!valid.isEmpty()) {
        const result: jsonContent = {
          message: 'Internal Server Error',
          data: null,
          error: valid
        }
        res.status(500).json(result)
        return
      }

      const fileId: number = Number(req.body.file_id)
      let getFileDto: getFileDtoInterface = {id: Number(fileId), userId: curentUser.id}
      if(curentUser.role === userRoleEnum.ADMNINISTRATOR){
        getFileDto = {id: Number(req.params.file_id)}
      }
      const file: File = await this.repository.fileRepository.getFile(getFileDto)
      const references: Reference = await this.repository.referenceRepository.getReference({id: file.referenceId})

      const defaultExpiration_date = new Date(new Date().getTime() + API_URL_LIVE_TIME);  

      const addLinkDto : addLinkDtoInterface = {
        userId: curentUser.id,
        fileId: fileId,
        expiredAt: req.body.expiration_date? new Date(req.body.expiration_date): defaultExpiration_date
      }

      const link: Link = await this.repository.linkRepository.addLink(addLinkDto)
      const payload = { 
        link: link.id,
        file: file.id
      }
      const token: string = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
      const url: string = `${API_PROTOCOL}://${API_HOST}/api/download?token=${encodeURIComponent(token)}`;
      const data = {
        link: link, 
        url: url
      }

      const result:jsonContent = {
        message: 'Infos retrieved successfully',
        data: data, 
        error: null
      }
      res.status(200).json(result)     
    } catch (error: any) {
      this.service.loggerService.error(ERRORS.CREATE_LINK_CONTROLLER_FAIL)
      const result: jsonContent = {
        message: 'Internal Server Error',
        data: null, 
        error: {
          message: error.message,
          cause: error.cause ? JSON.stringify(error.cause, Object.getOwnPropertyNames(error.cause)) : null,
        }
      }
      res.status(500).json(result)
    }
  }
}

