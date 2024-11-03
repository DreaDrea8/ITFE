import fs from 'fs';
import mime from "mime"
import jwt from 'jsonwebtoken'
import { Request, Response } from "express"
import { validationResult } from "express-validator"

import ERRORS from "@src/commons/Error"
import { Service } from "@src/services/service"
import { jsonContent } from "@src/types/jsonContent"
import { Repository } from "@src/repositories/Repository"
import { JWT_SECRET } from '@src/commons/config';
import { Link } from '@src/entities/Link';
import { File } from '@src/entities/File';

export class DownloadWithLink {
  repository: Repository
  service: Service

  constructor(repository: Repository, service: Service) { 
    this.repository = repository
    this.service = service
  }

  execute = async (req: Request, res: Response) =>{
    try {
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

      const encodeToken = req.query.token
      if (typeof encodeToken !== 'string') {
        const result: jsonContent = {
          message: 'Internal Server Error',
          data: null,
          error: {
            message: "Invalid token", 
            cause: encodeToken
          }
        }
        res.status(500).json(result)
        return
      }

      const token = decodeURIComponent(encodeToken)
      let decodeJwt : any 

      try {

        decodeJwt = jwt.verify(token, JWT_SECRET);

      } catch (error:any) {
        if (error.name === 'TokenExpiredError') {
          const result: jsonContent = {
            message: 'Internal Server Error',
            data: null,
            error:{ message:'Token expired'}
          }
          res.status(401).json(result);
          return
        }
        const result: jsonContent = {
          message: 'Internal Server Error',
          data: null,
          error:{ message:'Token invalide', cause:error.message }
        }
        res.status(403).json(result);
        return
      }
      
      const link: Link = await this.repository.linkRepository.getLink({id: decodeJwt.link})
      if(!link.expiredAt || new Date(link.expiredAt) < new  Date) {
        const result: jsonContent = {
          message: 'Internal Server Error',
          data: null,
          error:{ message:'Link expired' }
        }
        res.status(403).json(result);
        return
      }
      const file: File = await this.repository.fileRepository.getFile({id: decodeJwt.file})
      const referenceId: string = file.referenceId.toString()

      const filePath = await this.service.fileSystemService.uploadFile('', 'files', referenceId)
      if(!filePath || filePath === '')  throw new Error('error uploadfile')

      const extension = mime.extension(file.mimetype);
      const fileName: string = extension ? (file.fileName + '.' + extension): file.originalFileName

      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', file.mimetype);
      
      const fileStream = fs.createReadStream(filePath);

      fileStream.on('error', (error) => {
        this.service.loggerService.error(ERRORS.GET_FILE_CONTROLLER_FAIL);
        res.setHeader('Content-Type', 'application/json');
        const result: jsonContent = {
          message: 'Internal Server Error',
          data: file,
          error: {
            message: error.message,
            cause: error.cause ? JSON.stringify(error.cause, Object.getOwnPropertyNames(error.cause)) : null,
          }
        };
        res.status(500).json(result);
        return
      });
      fileStream.pipe(res);
    } catch (error: any) {
      this.service.loggerService.error(ERRORS.GET_FILE_CONTROLLER_FAIL)
      res.setHeader('Content-Type', 'application/json');
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