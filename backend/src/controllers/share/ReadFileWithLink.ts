import fs from 'fs'
import mime from "mime"
import jwt from 'jsonwebtoken'
import { Request, Response } from "express"
import { validationResult } from "express-validator"

import ERRORS from "@src/commons/Error"
import { Link } from '@src/entities/Link'
import { File } from '@src/entities/File'
import { Service } from "@src/services/service"
import { JWT_SECRET } from '@src/commons/config'
import { jsonContent } from "@src/types/jsonContent"
import { Repository } from "@src/repositories/Repository"


export class ReadFileWithLink {
  service: Service
  repository: Repository

  constructor(repository: Repository, service: Service) { 
    this.service = service
    this.repository = repository
  }

  execute = async (req: Request, res: Response) =>{
    try {
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
      
      const encodeToken = req.query.token

      if (typeof encodeToken !== 'string') {
          const result: jsonContent = {
            message: 'Invalid request',
            data: null,
            error: encodeToken
          }
          res.status(400).json(result)
        return
      }

      const token = decodeURIComponent(encodeToken)
      let decodeJwt : any 

      try {
        decodeJwt = jwt.verify(token, JWT_SECRET)
      } catch (error:any) {
        if (error.name === 'TokenExpiredError') {
          const result: jsonContent = {
            message: 'Invalid request',
            data: null,
            error: this.service.formatError(error, ERRORS.SHARE_FILE_WITH_LINK_CONTROLLER_FAIL_TOKEN_EXPIRED)
          }
          res.status(401).json(result)
          return
        }
        const result: jsonContent = {
          message: 'Access denied',
          data: null,
          error: this.service.formatError(error, ERRORS.SHARE_FILE_WITH_LINK_CONTROLLER_FAIL_INVALID_TOKEN)
        }
        res.status(403).json(result)
        return
      }
      
      const link: Link|null = await this.repository.linkRepository.selectLink({id: decodeJwt.link})
      if(!link){
        const result: jsonContent = {
          message: 'Resource not found.',
          data: null,
          error:{ message: ERRORS.SHARE_FILE_WITH_LINK_CONTROLLER_FAIL_LINK_NOT_FOUND }
        }
        res.status(404).json(result)
        return
      }
      if(!link.revokedAt || new Date(link.revokedAt) < new Date) {
        const result: jsonContent = {
          message: 'Access denied',
          data: null,
          error:{ message: ERRORS.SHARE_FILE_WITH_LINK_CONTROLLER_FAIL_LINK_EXPIRED }
        }
        res.status(403).json(result)
        return
      }

      const file: File|null = await this.repository.fileRepository.selectFile({id: decodeJwt.file})
      if(!file){
        const result: jsonContent = {
          message: 'Resource not found.',
          data: null,
          error:{ message: ERRORS.SHARE_FILE_WITH_LINK_CONTROLLER_FAIL_FILE_NOT_FOUND }
        }
        res.status(404).json(result)
        return
      }

      const result:jsonContent = {
        message: 'Request was successful',
        data: file, 
        error: null
      }
      res.status(200).json(result)
    } catch (error: any) {
      this.service.loggerService.error(ERRORS.SHARE_FILE_WITH_LINK_CONTROLLER_FAIL)
      res.setHeader('Content-Type', 'application/json')
      const result: jsonContent = {
        message: "General server error",
        data: null,
        error: this.service.formatError(error, ERRORS.SHARE_FILE_WITH_LINK_CONTROLLER_FAIL)
      }
      res.status(500).json(result)
    }
  }
}