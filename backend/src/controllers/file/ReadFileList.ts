import { Request, Response } from "express"

import ERRORS from "@src/commons/Error"
import { File } from "@src/entities/File"
import { Service } from "@src/services/service"
import { jsonContent } from "@src/types/jsonContent"
import { User, userRoleEnum } from "@src/entities/User"
import { selectFileListWhereDtoInterface } from "@src/repositories/FileRepository"
import { comparisonOperatorEnum, fileKeyEnum, logicalOperatorEnum, Repository, whereInterface } from "@src/repositories/Repository"

interface FileListInterface {
  [key: string]: File[]
}

export class ReadFileList {
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

      let files : FileListInterface = {}

      const filterByUserId: whereInterface =  {
        logicalOperator: logicalOperatorEnum.AND,
        key: fileKeyEnum.USER_ID,
        comparisonOperator: comparisonOperatorEnum.EQUALS,
        value: `${curentUser.id}`
      }
      const dto: selectFileListWhereDtoInterface = {
        where: [filterByUserId]
      }
      const userFiles: File[] = await this.repository.fileRepository.selectFileListWhere(dto)
      userFiles.length? files['user'] = userFiles: null

      const shareFiles: File[] = []
      shareFiles.length? files['share'] = shareFiles: null

      if(curentUser.role === userRoleEnum.ADMINISTRATOR){
        const filterByUserIdAdmin: whereInterface =  {
          logicalOperator: logicalOperatorEnum.AND,
          key: fileKeyEnum.USER_ID,
          comparisonOperator: comparisonOperatorEnum.NOT_EQUALS,
          value: `${curentUser.id}`
        }
        const dtoAdmin: selectFileListWhereDtoInterface = {
          where: [filterByUserIdAdmin]
        }
        const otherFiles: File[] = await this.repository.fileRepository.selectFileListWhere(dtoAdmin)
        otherFiles.length? files['other'] = otherFiles: null
      }

      const result:jsonContent = {
        message: 'Request was successful',
        data: files, 
        error: null
      }
      res.status(200).json(result) 

    } catch (error: any) {
      this.service.loggerService.error(ERRORS.READ_FILE_LIST_CONTROLLER_FAIL)
      const result: jsonContent = {
        message: "General server error",
        data: null,
        error: this.service.formatError(error, ERRORS.READ_FILE_LIST_CONTROLLER_FAIL)
      }
      res.status(500).json(result)
    }
  }
}


