import { Request, Response } from "express"
import { validationResult } from "express-validator"

import ERRORS from "@src/commons/Error"
import { Service } from "@src/services/service"
import { jsonContent } from "@src/types/jsonContent"
import { Repository } from "@src/repositories/Repository"
import { adminExemple, User, userExemple, userRoleEnum } from "@src/entities/User"
import { getFileDtoInterface, patchFileDtoInterface } from "@src/repositories/FileRepository"

export class UpdateFile {
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

      let getFileDto: getFileDtoInterface = {id: Number(req.params.file_id), userId: curentUser.id}
      if(curentUser.role === userRoleEnum.ADMNINISTRATOR){
        getFileDto = {id: Number(req.params.file_id)}
      }

      await this.repository.fileRepository.getFile(getFileDto)
 
      const updateFileDto: patchFileDtoInterface = {
        id: Number(req.params.file_id), 
        libelle: req.body.libelle,
        description: req.body?.description,
        fileName: req.body?.fileName
      }
      const fileRepositoryResult = await this.repository.fileRepository.patchFile(updateFileDto)

      const result:jsonContent = {
        message: 'Infos retrieved successfully',
        data: fileRepositoryResult, 
        error: null
      }
      res.status(200).json(result)       
    } catch (error: any) {
      this.service.loggerService.error(ERRORS.PATCH_FILE_CONTROLLER_FAIL)
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


