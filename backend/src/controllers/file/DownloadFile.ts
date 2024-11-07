import fs from 'fs';
import mime from "mime"
import { Request, Response } from "express"
import { validationResult } from "express-validator"

import ERRORS from "@src/commons/Error"
import { File } from '@src/entities/File'
import { Service } from "@src/services/service"
import { jsonContent } from "@src/types/jsonContent"
import { User, userRoleEnum } from "@src/entities/User"
import { Repository } from "@src/repositories/Repository"
import { selectFileDtoInterface } from '@src/repositories/FileRepository'

export class DownloadFile {
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

      let dto: selectFileDtoInterface = {id: Number(req.params.file_id), userId: curentUser.id}

      if(curentUser.role === userRoleEnum.ADMINISTRATOR){
        dto = {id: Number(req.params.file_id)}
      }

      const file: File|null = await this.repository.fileRepository.selectFile(dto)

      if(!file){
        const result: jsonContent = {
          message: 'Resource not found.',
          data: null,
          error:{ message: ERRORS.DOWNLOAD_FILE_CONTROLLER_FAIL_FILE_NOT_FOUND }
        }
        res.status(404).json(result)
        return
      }

      const referenceId: string = file.referenceId.toString()
      const filePath = await this.service.fileSystemService.uploadFile('', 'files', referenceId)
      if(!filePath || filePath === '')  throw new Error(ERRORS.DOWNLOAD_FILE_CONTROLLER_FAIL_FILE_NOT_FOUND)

      const extension = mime.extension(file.mimetype)
      const fileName = encodeURIComponent(extension ? (file.fileName + '.' + extension) : file.originalFileName)

      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', file.mimetype);
      
      const fileStream = fs.createReadStream(filePath);

      fileStream.on('error', (error) => {
        this.service.loggerService.error(ERRORS.DOWNLOAD_FILE_CONTROLLER_FAIL);
        res.setHeader('Content-Type', 'application/json');
        const result: jsonContent = {
          message: "General server error",
          data: file,
          error: this.service.formatError(error, ERRORS.DOWNLOAD_FILE_CONTROLLER_FAIL)
        };
        res.status(500).json(result);
        return
      });

      fileStream.pipe(res);

    } catch (error: any) {
      this.service.loggerService.error(ERRORS.DOWNLOAD_FILE_CONTROLLER_FAIL)
      res.setHeader('Content-Type', 'application/json');
      const result: jsonContent = {
        message: "General server error",
        data: null,
        error: this.service.formatError(error, ERRORS.DOWNLOAD_FILE_CONTROLLER_FAIL)
      }
      res.status(500).json(result)
    }
  }
}