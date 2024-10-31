import { Request, Response } from "express"

import ERRORS from "@src/commons/Error"
import { jsonContent } from "@src/types/jsonContent"
import { Repository } from "@src/repositories/Repository"
import loggerService from "@src/services/logger/LoggerService"
import { getFileDtoInterface } from "@src/repositories/FileRepository"

export class GetFile {
  repository: Repository

  constructor(repository: Repository) {
    this.repository = repository
  }

  async execute (req: Request, res: Response ){
    try {
      const dto: getFileDtoInterface = {id: 1}
      const fileRepositoryResult = await this.repository.fileRepository.removeFile(dto)

      const result:jsonContent = {
        message: 'Infos retrieved successfully',
        data: fileRepositoryResult, 
        error: null
      }
      res.status(200).json(result)     
    } catch (error: any) {
      loggerService.error(ERRORS.GET_FILE_CONTROLLER_FAIL)
      const result: jsonContent = {
        message: 'Internal Server Error',
        data: null, 
        error: error.message
      }
      res.status(500).json(result)
    }
  }
}


