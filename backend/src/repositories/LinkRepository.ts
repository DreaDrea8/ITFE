import { Connection } from "mysql2"

import ERRORS from "@src/commons/Error"
import { File, FileDtoInterface } from "@src/entities/File"
import loggerService from "@src/services/logger/LoggerService"
import { whereInterface } from "./Repository"
import { Service } from "@src/services/service"
import { Link, LinkDtoInterface } from "@src/entities/Link"

export class LinkRepository {
  service: Service
  database: Connection;

  constructor(database: Connection, service: Service) {
    this.database = database;
    this.service = service
  }

  async addLink(dto: addLinkDtoInterface): Promise<Link> {
    try {
      const insertQuery = `
        INSERT INTO \`link\` (
          user_id,
          file_id,
          expired_at
        ) VALUES (?, ?, ?)
      `;

      const result: any = await this.database.promise().query(insertQuery, [
        dto.userId,
        dto.fileId,
        dto.expiredAt
      ]);
      const link = await this.getLink({id: result[0].insertId})

      return link;
    } catch (error) {
      loggerService.error(ERRORS.ADD_LINK_REPOSITORY_FAIL);
      throw new Error(ERRORS.ADD_LINK_REPOSITORY_FAIL, { cause: error });
    }
  }

  async getLink(dto: getLinkDtoInterface): Promise<Link> {
    try {
      let selectQuery = `
        SELECT id, user_id, file_id, expired_at, created_at, updated_at
        FROM \`link\`
        WHERE id = ?
        `;
      const queryParams: (number | string)[] = [dto.id];
  
      if (dto.userId !== undefined) {
        selectQuery += ` AND user_id = ?`;
        queryParams.push(dto.userId);
      }

      const result: any = await this.database.promise().query(selectQuery, queryParams);
      const resultLink = result[0]
      
      if (resultLink.length === 0) throw new Error(ERRORS.LINK_NOT_FOUND, {cause: {result}});
      if (resultLink.length !== 1) throw new Error(ERRORS.LINK_NOT_FOUND, {cause: {result}});
      
      const linkDto: LinkDtoInterface = {
        id: resultLink[0].id,
        userId: resultLink[0].user_id,
        fileId: resultLink[0].file_id,
        expiredAt: new Date(resultLink[0].expired_at),
        createdAt: new Date(resultLink[0].created_at),
        updatedAt: new Date(resultLink[0].updated_at),
      }

      const link = new Link(linkDto);
      return link;
    } catch (error) {
      this.service.loggerService.error(ERRORS.GET_LINK_REPOSITORY_FAIL);
      throw new Error(ERRORS.GET_LINK_REPOSITORY_FAIL, { cause: error });
    }
  }


  async getLinks(): Promise<Link[]> {
    try {
      let selectQuery = `
      SELECT id, user_id, file_id, expired_at, created_at, updated_at
      FROM \`link\`
    `;
      const result: any = await this.database.promise().query(selectQuery);
      const rows = result[0]

      const links = rows.map((row: any) => {
        const dto: LinkDtoInterface = {
          id: row.id,
          userId: row.user_id,
          fileId: row.file_id,
          expiredAt: new Date(row.expired_at),
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
        }
        return new Link(dto)
      });
      return links;
    } catch (error) {
      this.service.loggerService.error(ERRORS.GET_LINKS_REPOSITORY_FAIL);
      throw new Error(ERRORS.GET_LINKS_REPOSITORY_FAIL, { cause: error });
    }
  }

  async getLinksWhere(dto: getLinksWhereDtoInterface): Promise<Link[]> {
    try {
      const whereClauses: string[] = [];
      const params: any[] = [];
  
      dto.where.forEach((condition) => {
        const clause = `${condition.logicalOperator} \`${condition.key}\` ${condition.comparisonOperator} ?`;
        whereClauses.push(clause);
        params.push(condition.value);
      });
  
      const whereString = whereClauses.join(' ');
      let selectQuery = `
      SELECT id, user_id, file_id, expired_at, created_at, updated_at
      FROM \`link\`
      WHERE 1 = 1 ${whereString}`;
      const result: any = await this.database.promise().query(selectQuery, params);
      const rows = result[0]

      const links = rows.map((row: any) => {
        const dto: LinkDtoInterface = {
          id: row.id,
          userId: row.user_id,
          fileId: row.file_id,
          expiredAt: new Date(row.expired_at),
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
        }
        return new Link(dto)
      });
      return links;
    } catch (error) {
      this.service.loggerService.error(ERRORS.GET_LINKS_WHERE_REPOSITORY_FAIL);
      throw new Error(ERRORS.GET_LINKS_WHERE_REPOSITORY_FAIL, { cause: error });
    }
  }

}

export interface addLinkDtoInterface {
  userId: number
  fileId: number
  expiredAt: Date
}

export interface getLinkDtoInterface {
  id: number
  userId?: number
}

export interface getLinksWhereDtoInterface {
  where: Array<whereInterface>
}
