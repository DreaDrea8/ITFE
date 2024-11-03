import { Connection } from "mysql2";

import ERRORS from "@src/commons/Error";
import { Service } from "@src/services/service";

import { whereInterface } from "./Repository";
import { Reference, ReferenceDtoInterface } from "@src/entities/Reference";


export class ReferenceRepository {
  service: Service
  database: Connection;

  constructor(database: Connection, service: Service) {
    this.database = database;
    this.service = service
  }

  async addReference(dto: addReferenceDtoInterface): Promise<Reference> {
    try {
      const insertQuery = `
        INSERT INTO reference (signature, \`usage\`) VALUES (?, ?)
      `;

      const result: any = await this.database.promise().query(insertQuery, [
        dto.signature,
        dto.usage
      ]);

      const reference = await this.getReference({id: result[0].insertId})
      
      return reference;
    } catch (error) {
      this.service.loggerService.error(ERRORS.ADD_REFERENCE_REPOSITORY_FAIL);
      throw new Error(ERRORS.ADD_REFERENCE_REPOSITORY_FAIL, { cause: error });
    }
  }

  async getReference(dto: getReferenceDtoInterface): Promise<Reference> {
    try {
      const selectQuery = `SELECT * FROM \`reference\` WHERE id = ?`;
      const result: any = await this.database.promise().query(selectQuery, [dto.id])
      const resultReference = result[0]

      if (resultReference.length === 0) throw new Error(ERRORS.REFERENCE_NOT_FOUND, {cause: {result}});
      if (resultReference.length !== 1) throw new Error(ERRORS.REFERENCE_NOT_FOUND, {cause: {result}});
      
      const referenceDto: ReferenceDtoInterface = {
        id: resultReference[0].id,
        signature: resultReference[0].signature,
        usage: resultReference[0].usage,
        createdAt: new Date(resultReference[0].created_at),
        updatedAt: new Date(resultReference[0].updated_at)
      }

      const reference =  new Reference(referenceDto)
      return reference;
    } catch (error) {
      this.service.loggerService.error(ERRORS.GET_REFERENCE_REPOSITORY_FAIL);
      throw new Error(ERRORS.GET_REFERENCE_REPOSITORY_FAIL, { cause: error });
    }
  }

  async getReferences(): Promise<Reference[]> {
    try {
      const selectQuery = `SELECT * FROM \`reference\``;
      const result: any = await this.database.promise().query(selectQuery);
      const rows = result[0]

      const references = rows.map((row: any) => {
        const referenceDto: ReferenceDtoInterface = {
          id: row.id,
          signature: row.signature,
          usage: row.usage,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at)
        }
        return new Reference(referenceDto)
      });
      return references;
    } catch (error) {
      this.service.loggerService.error(ERRORS.GET_REFERENCES_REPOSITORY_FAIL);
      throw new Error(ERRORS.GET_REFERENCES_REPOSITORY_FAIL, { cause: error });
    }
  }

  async getReferencesWhere(dto: getReferencesWhereDtoInterface): Promise<Reference[]> {
    try {
      const whereClauses: string[] = [];
      const params: any[] = [];
  
      dto.where.forEach((condition) => {
        const clause = `${condition.logicalOperator} \`${condition.key}\` ${condition.comparisonOperator} ?`;
        whereClauses.push(clause);
        params.push(condition.value);
      });
  
      const whereString = whereClauses.join(' ');
      const selectQuery = `SELECT * FROM \`reference\` WHERE 1 = 1 ${whereString}`;
      const result: any = await this.database.promise().query(selectQuery, params);
      const rows = result[0]

      const references = rows.map((row: any) => {
        const referenceDto: ReferenceDtoInterface = {
          id: row.id,
          signature: row.signature,
          usage: row.usage,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at)
        }
        return new Reference(referenceDto)
      });
      return references;
    } catch (error) {
      this.service.loggerService.error(ERRORS.GET_REFERENCES_WHERE_REPOSITORY_FAIL);
      throw new Error(ERRORS.GET_REFERENCES_WHERE_REPOSITORY_FAIL, { cause: error });
    }
  }


  async patchReference(dto: patchReferenceDtoInterface): Promise<Reference> {
    try {
      const updates: string[] = [];
      const params: any[] = [];

      if (dto.signature) {
        updates.push("\`signature\` = ?");
        params.push(dto.signature);
      }

      if (updates.length === 0) throw new Error(ERRORS.NO_FIELDS_TO_UPDATE);

      const updateQuery = `UPDATE \`reference\` SET ${updates.join(", ")} WHERE id = ?`;
      params.push(dto.id);
      await this.database.promise().query(updateQuery, params);

      return await this.getReference({ id: dto.id });
    } catch (error) {
      this.service.loggerService.error(ERRORS.PATCH_REFERENCE_REPOSITORY_FAIL);
      throw new Error(ERRORS.PATCH_REFERENCE_REPOSITORY_FAIL, { cause: error });
    }
  }

  async removeReference(dto: removeReferenceDtoInterface): Promise<boolean> {
    try {
      const deleteQuery = `DELETE FROM \`reference\` WHERE id = ?`;
      await this.database.query(deleteQuery, [dto.id]);
      return true;
    } catch (error) {
      this.service.loggerService.error(ERRORS.REMOVE_REFERENCE_REPOSITORY_FAIL);
      throw new Error(ERRORS.REMOVE_REFERENCE_REPOSITORY_FAIL, { cause: error });
    }
  }
}

export interface addReferenceDtoInterface {
  signature: string
  usage: number
}

export interface getReferenceDtoInterface {
  id: number
}

export interface getReferencesWhereDtoInterface {
  where: Array<whereInterface>
}

export interface patchReferenceDtoInterface {
  id: number
  signature?: string
  usage?: number
}

export interface removeReferenceDtoInterface {
  id: number
}