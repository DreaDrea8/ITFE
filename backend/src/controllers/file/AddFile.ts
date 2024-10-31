import { Request, Response } from "express"

import ERRORS from "@src/commons/Error"
import { jsonContent } from "@src/types/jsonContent"
import { Repository } from "@src/repositories/Repository"
import loggerService from "@src/services/logger/LoggerService"

export class AddFile {
  repository: Repository

  constructor(repository: Repository) {
    this.repository = repository
  }

  execute = async (req: Request, res: Response) =>{
    try {
      const fileRepositoryResult = await this.repository.fileRepository.addFile

      const result:jsonContent = {
        message: 'Infos retrieved successfully',
        data: fileRepositoryResult, 
        error: null
      }
      res.status(200).json(result)      
    } catch (error: any) {
      loggerService.error(ERRORS.ADD_FILE_CONTROLLER_FAIL)
      const result: jsonContent = {
        message: 'Internal Server Error',
        data: null, 
        error: error.message
      }
      res.status(500).json(result)
    }
  }
}


