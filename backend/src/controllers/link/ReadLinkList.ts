import { Request, Response } from "express"

import ERRORS from "@src/commons/Error"
import { Link } from "@src/entities/Link"
import { User } from "@src/entities/User"
import { Service } from "@src/services/service"
import { jsonContent } from "@src/types/jsonContent"
import { selectLinkListWhereDtoInterface } from "@src/repositories/LinkRepository"
import { comparisonOperatorEnum, linkKeyEnum, logicalOperatorEnum, Repository, whereInterface } from "@src/repositories/Repository"


export class ReadLinkList {
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

      const filterByUserId: whereInterface =  {
        logicalOperator: logicalOperatorEnum.AND,
        key: linkKeyEnum.USER_ID,
        comparisonOperator: comparisonOperatorEnum.EQUALS,
        value: `${curentUser.id}`
      }
      const dto: selectLinkListWhereDtoInterface = {
        where: [filterByUserId]
      }
      const linkListResult: Link[] = await this.repository.linkRepository.selectLinkListWhere(dto)

      const result:jsonContent = {
        message: 'Request was successful',
        data: linkListResult, 
        error: null
      }
      res.status(200).json(result) 

    } catch (error: any) {
      this.service.loggerService.error(ERRORS.READ_LINK_LIST_CONTROLLER_FAIL)
      const result: jsonContent = {
        message: "General server error",
        data: null,
        error: this.service.formatError(error, ERRORS.READ_LINK_LIST_CONTROLLER_FAIL)
      }
      res.status(500).json(result)
    }
  }
}


