import { Request, Response } from "express"
import { validationResult } from "express-validator"

import ERRORS from "@src/commons/Error"
import { Service } from "@src/services/service"
import { jsonContent } from "@src/types/jsonContent"
import { Repository } from "@src/repositories/Repository"
import { adminExemple, User, userExemple, userRoleEnum } from "@src/entities/User"
import { getExtendFileDtoInterface, removeHardFileDtoInterface } from "@src/repositories/FileRepository"

export class DeleteHardFile {
  repository: Repository
  service: Service

  constructor(repository: Repository, service: Service) {
    this.repository = repository
    this.service = service
  }

  execute = async (req: Request, res: Response) =>{
    try {
      const curentUser: User = adminExemple //TODO auth
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

      if (curentUser.role !== userRoleEnum.ADMNINISTRATOR){
        const result: jsonContent = {
          message: 'Internal Server Error',
          data: null,
          error: 'not autorize'
        }
        res.status(500).json(result)
        return
      }

      const id: number = Number(req.params.file_id)
      let getFileDto: getExtendFileDtoInterface = {id: id}
      await this.repository.fileRepository.getExtendFile(getFileDto)

      let removeFileDto : removeHardFileDtoInterface = {id: id}
      const file = await this.repository.fileRepository.removeHardFile(removeFileDto)

      const result:jsonContent = {
        message: 'Infos retrieved successfully',
        data: file, 
        error: null
      }
      res.status(200).json(result)     
    } catch (error: any) {
      this.service.loggerService.error(ERRORS.REMOVE_HARD_FILE_CONTROLLER_FAIL)
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


