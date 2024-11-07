import { Request, Response } from "express"
import { validationResult } from "express-validator"

import ERRORS from "@src/commons/Error"
import { File } from "@src/entities/File"
import { User, userRoleEnum } from "@src/entities/User"
import { Service } from "@src/services/service"
import { jsonContent } from "@src/types/jsonContent"
import { Repository } from "@src/repositories/Repository"
import { selectFileDtoInterface, updateRevokedAtFileDtoInterface } from "@src/repositories/FileRepository"


export class DeleteFile {
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

      const id: number = Number(req.params.file_id)

      let getFileDto: selectFileDtoInterface = {id: id, userId: curentUser.id}
      if(curentUser.role === userRoleEnum.ADMINISTRATOR){
        getFileDto = {id: Number(req.params.file_id)}
      }


      const file: File|null = await this.repository.fileRepository.selectFile(getFileDto)


      if(!file){
        const result: jsonContent = {
          message: 'Resource not found.',
          data: null,
          error:{ message: ERRORS.DELETE_FILE_CONTROLLER_FAIL_FILE_NOT_FOUND }
        }
        res.status(404).json(result)
        return
      }

      const dto: updateRevokedAtFileDtoInterface = {
        id: id
      }

      const fileResult = await this.repository.fileRepository.updateRevokedAtFile(dto)
      if(!fileResult){
        throw new Error(ERRORS.DELETE_FILE_CONTROLLER_FAIL_FILE_NOT_DELETED)
      }

      const result:jsonContent = {
        message: 'Request was successful',
        data: true, 
        error: null
      }
      res.status(200).json(result)     

    } catch (error: any) {
      this.service.loggerService.error(ERRORS.DELETE_FILE_CONTROLLER_FAIL)
      const result: jsonContent = {
        message: "General server error",
        data: null,
        error: this.service.formatError(error, ERRORS.DELETE_FILE_CONTROLLER_FAIL)
      }
      res.status(500).json(result)
    }
  }
}


