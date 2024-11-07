import { Response } from "express"

import ERRORS from "@src/commons/Error"
import { Service } from "@src/services/service"
import { jsonContent } from "@src/types/jsonContent"
import { User } from "@src/entities/User"
import { Repository} from "@src/repositories/Repository"
import { MAX_SIZE_USER } from "@src/commons/config"


export class ReadTotalSizeFile {
  repository: Repository
  service: Service

  constructor(repository: Repository, service: Service) {
    this.repository = repository
    this.service = service
  }

  execute = async (req: any, res: Response) => {
    try {
      const curentUser: User | undefined = req.user 
      if(!curentUser){
        throw new Error(ERRORS.CURRENT_USER_NOT_FOUND)
      }

      const totalSize:number = await this.repository.fileRepository.selectTotalFileSizeByUser({userId: curentUser.id})

      const result: jsonContent = {
        message: 'Request was successful',
        data: {
          'total-size': totalSize,
          'max-size' : MAX_SIZE_USER
        },
        error: null
      }
      res.status(200).json(result)

    } catch (error: any) {
      this.service.loggerService.error(ERRORS.READ_TOTAL_SIZE_FILE_CONTROLLER_FAIL)
      const result: jsonContent = {
        message: "General server error",
        data: null,
        error: this.service.formatError(error, ERRORS.READ_TOTAL_SIZE_FILE_CONTROLLER_FAIL)
      }
      res.status(500).json(result)
    }
  }
}