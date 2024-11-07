import { Connection } from "mysql2"

import ERRORS from "@src/commons/Error"
import { whereInterface } from "./Repository"
import { Service } from "@src/services/service"
import { Link, LinkDtoInterface } from "@src/entities/Link"


export interface insertLinkDtoInterface {
  userId: number
  fileId: number
  revokedAt: Date
}

export interface selectLinkDtoInterface {
  id: number
  userId?: number
}

export interface selectLinkListWhereDtoInterface {
  where: Array<whereInterface>
}


export class LinkRepository {
  service: Service
  database: Connection

  constructor(database: Connection, service: Service) {
    this.database = database
    this.service = service
  }

  async insertLink(dto: insertLinkDtoInterface): Promise<Link> {
    try {
      const insertQuery = `
        INSERT INTO \`link\` (user_id, file_id, revoked_at) 
        VALUES (?, ?, ?)`

      const result: any = await this.database.promise().query(insertQuery, [
        dto.userId,
        dto.fileId,
        dto.revokedAt
      ])

      const linkResult: Link | null = await this.selectLink({id: result[0].insertId})
      if(!linkResult){
        this.service.loggerService.error(ERRORS.INSERT_LINK_REPOSITORY_FAIL_TO_ACCES_LINK)
        throw new Error(ERRORS.INSERT_LINK_REPOSITORY_FAIL_TO_ACCES_LINK)
      }
      
      return Promise.resolve(linkResult)

    } catch (error) {
      this.service.loggerService.error(ERRORS.INSERT_LINK_REPOSITORY_FAIL)
      throw new Error(ERRORS.INSERT_LINK_REPOSITORY_FAIL, { cause: error })
    }
  }

  async selectLink(dto: selectLinkDtoInterface): Promise<Link|null> {
    try {
      let selectQuery = `
        SELECT id, user_id, file_id, created_at, updated_at, revoked_at
        FROM \`link\`
        WHERE id = ? 
          AND (revoked_at IS NULL OR revoked_at > NOW())`
      const queryParams: (number | string)[] = [dto.id]
  
      if (dto.userId !== undefined) {
        selectQuery += ` AND user_id = ?`
        queryParams.push(dto.userId)
      }

      const result: any = await this.database.promise().query(selectQuery, queryParams)
      const link = result[0]

      if (link.length === 0) return Promise.resolve(null)
      if (link.length > 1) throw new Error(ERRORS.SELECT_LINK_REPOSITORY_FAIL)
      
      const linkDto: LinkDtoInterface = {
        id: link[0].id,
        userId: link[0].user_id ? link[0].user_id : null,
        fileId: link[0].file_id,
        createdAt: new Date(link[0].created_at),
        updatedAt: new Date(link[0].updated_at),
        revokedAt: new Date(link[0].revoked_at)
      }
      const linkResult = new Link(linkDto)
      return Promise.resolve(linkResult)

    } catch (error) {
      this.service.loggerService.error(ERRORS.SELECT_LINK_REPOSITORY_FAIL)
      throw new Error(ERRORS.SELECT_LINK_REPOSITORY_FAIL, { cause: error })
    }
  }

  async selectLinkList(): Promise<Link[]> {
    try {
      let selectQuery = `
        SELECT id, user_id, file_id, created_at, updated_at, revoked_at
        FROM \`link\`
        WHERE (revoked_at IS NULL OR revoked_at > NOW())`
      const result: any = await this.database.promise().query(selectQuery)
      const linkList = result[0]

      const linkListResult = linkList.map((link: any) => {
        const dto: LinkDtoInterface = {
          id: link.id,
          userId: link.user_id ? link.user_id : null,
          fileId: link.file_id,
          createdAt: new Date(link.created_at),
          updatedAt: new Date(link.updated_at),
          revokedAt: new Date(link.revoked_at)
        }
        return new Link(dto)
      })

      return Promise.resolve(linkListResult)

    } catch (error) {
      this.service.loggerService.error(ERRORS.SELECT_LINK_LIST_REPOSITORY_FAIL)
      throw new Error(ERRORS.SELECT_LINK_LIST_REPOSITORY_FAIL, { cause: error })
    }
  }

  async getLinksWhere(dto: selectLinkListWhereDtoInterface): Promise<Link[]> {
    try {
      const whereClauses: string[] = []
      const params: any[] = []
  
      dto.where.forEach((condition) => {
        const clause = `${condition.logicalOperator} \`${condition.key}\` ${condition.comparisonOperator} ?`
        whereClauses.push(clause)
        params.push(condition.value)
      })
  
      const whereString = whereClauses.join(' ')
      let selectQuery = `
        SELECT id, user_id, file_id, created_at, updated_at, revoked_at
        FROM \`link\`
        WHERE (revoked_at IS NULL OR revoked_at > NOW()) ${whereString}`
      const result: any = await this.database.promise().query(selectQuery, params)
      const linkList = result[0]

      const linkListResult = linkList.map((link: any) => {
        const dto: LinkDtoInterface = {
          id: link.id,
          userId: link.user_id ? link.user_id : null,
          fileId: link.file_id,
          createdAt: new Date(link.created_at),
          updatedAt: new Date(link.updated_at),
          revokedAt: new Date(link.revoked_at)
        }
        return new Link(dto)
      })

      return Promise.resolve(linkListResult)

    } catch (error) {
      this.service.loggerService.error(ERRORS.SELECT_LINK_LIST_WHERE_REPOSITORY_FAIL)
      throw new Error(ERRORS.SELECT_LINK_LIST_WHERE_REPOSITORY_FAIL, { cause: error })
    }
  }

}