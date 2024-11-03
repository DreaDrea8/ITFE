import { Request, Response } from "express"

import ERRORS from "@src/commons/Error"
import { File } from "@src/entities/File"
import { Service } from "@src/services/service"
import { jsonContent } from "@src/types/jsonContent"
import { getFilesWhereDtoInterface } from "@src/repositories/FileRepository"
import { adminExemple, User, userExemple, userRoleEnum } from "@src/entities/User"
import { comparisonOperatorEnum, fileKeyEnum, logicalOperatorEnum, Repository, whereInterface } from "@src/repositories/Repository"

interface FilesInterface {
  [key: string]: File[]
}

export class ReadFiles {
  repository: Repository
  service: Service

  constructor(repository: Repository, service: Service) {
    this.repository = repository
    this.service = service
  }

  execute = async (req: Request, res: Response) =>{
    try {
      const curentUser: User = userExemple //TODO auth
      let files : FilesInterface = {}

      const filterByUserId: whereInterface =  {
        logicalOperator: logicalOperatorEnum.AND,
        key: fileKeyEnum.USER_ID,
        comparisonOperator: comparisonOperatorEnum.EQUALS,
        value: `${curentUser.id}`
      }
      const dto: getFilesWhereDtoInterface = {
        where: [filterByUserId]
      }
      const userFiles: File[] = await this.repository.fileRepository.getFilesWhere(dto)
      userFiles.length? files['userFiles'] = userFiles: null
      const shareFiles: File[] = []
      shareFiles.length? files['shareFiles'] = shareFiles: null

      if(curentUser.role === userRoleEnum.ADMNINISTRATOR){
        const filterByUserId: whereInterface =  {
          logicalOperator: logicalOperatorEnum.AND,
          key: fileKeyEnum.USER_ID,
          comparisonOperator: comparisonOperatorEnum.NOT_EQUALS,
          value: `${curentUser.id}`
        }
        const dto: getFilesWhereDtoInterface = {
          where: [filterByUserId]
        }
        const otherFiles: File[] = await this.repository.fileRepository.getFilesWhere(dto)
        otherFiles.length? files['otherFiles'] = otherFiles: null
      }

      const result:jsonContent = {
        message: 'Infos retrieved successfully',
        data: files, 
        error: null
      }
      res.status(200).json(result)        
    } catch (error: any) {
      this.service.loggerService.error(ERRORS.GET_FILES_CONTROLLER_FAIL)
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


