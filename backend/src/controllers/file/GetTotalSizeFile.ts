import { Response } from "express"

import ERRORS from "@src/commons/Error"
import { Service } from "@src/services/service"
import { jsonContent } from "@src/types/jsonContent"
import { User, userExemple } from "@src/entities/User"
import { Repository} from "@src/repositories/Repository"


export class GetTotalSizeFile {
  repository: Repository
  service: Service

  constructor(repository: Repository, service: Service) {
    this.repository = repository
    this.service = service
  }

  execute = async (req: any, res: Response) => {
    try {
      const curentUser: User = userExemple //TODO auth

      const totalSize:number = await this.repository.fileRepository.getTotalFileSizeByUser({userId: curentUser.id})

      const result: jsonContent = {
        message: 'Infos retrieved successfully',
        data: totalSize,
        error: null
      }
      res.status(200).json(result)
    } catch (error: any) {
      this.service.loggerService.error(ERRORS.GET_TOTAL_SIZE_FILE_CONTROLLER_FAIL)
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