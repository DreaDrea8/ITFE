import fs from 'fs';
import mime from "mime"
import { Request, Response } from "express"
import { validationResult } from "express-validator"

import ERRORS from "@src/commons/Error"
import { Service } from "@src/services/service"
import { jsonContent } from "@src/types/jsonContent"
import { Repository } from "@src/repositories/Repository"
import { User, userExemple, userRoleEnum } from "@src/entities/User"
import { getFileDtoInterface } from "@src/repositories/FileRepository"

export class DownloadFile {
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

      let dto: getFileDtoInterface = {id: Number(req.params.file_id), userId: curentUser.id}

      if(curentUser.role === userRoleEnum.ADMNINISTRATOR){
        dto = {id: Number(req.params.file_id)}
      }

      const file = await this.repository.fileRepository.getFile(dto)

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