import { Connection } from "mysql2"

import ERRORS from "@src/commons/Error"
import { whereInterface } from "./Repository"
import { Service } from "@src/services/service"
import { Reference, ReferenceDtoInterface } from "@src/entities/Reference"


export interface insertReferenceDtoInterface {
  signature: string
  usage: number
}

export interface selectReferenceDtoInterface {
  id: number
}

export interface selectReferenceListWhereDtoInterface {
  where: Array<whereInterface>
}

export interface updateReferenceDtoInterface {
  id: number
  signature?: string
  usage?: number
}

export interface deleteReferenceDtoInterface {
  id: number
}


export class ReferenceRepository {
  service: Service
  database: Connection

  constructor(database: Connection, service: Service) {
    this.database = database
    this.service = service
  }

  async insertReference(dto: insertReferenceDtoInterface): Promise<Reference> {
    try {
      const insertQuery = `
        INSERT INTO reference (signature, \`usage\`) VALUES (?, ?)`
      const result: any = await this.database.promise().query(insertQuery, [
        dto.signature,
        dto.usage
      ])

      const referenceResult: Reference | null = await this.selectReference({id: result[0].insertId})
      if(!referenceResult){
        this.service.loggerService.error(ERRORS.INSERT_REFERENCE_REPOSITORY_FAIL_TO_ACCES_REFERENCE)
        throw new Error(ERRORS.INSERT_REFERENCE_REPOSITORY_FAIL_TO_ACCES_REFERENCE)
      }
      
      return Promise.resolve(referenceResult)

    } catch (error) {
      this.service.loggerService.error(ERRORS.INSERT_REFERENCE_REPOSITORY_FAIL)
      throw new Error(ERRORS.INSERT_REFERENCE_REPOSITORY_FAIL, { cause: error })
    }
  }

  async selectReference(dto: selectReferenceDtoInterface): Promise<Reference|null> {
    try {
      const selectQuery = `
        SELECT * FROM \`reference\` 
        WHERE id = ? 
          AND (revoked_at IS NULL OR revoked_at > NOW())`
      const result: any = await this.database.promise().query(selectQuery, [dto.id])
      const reference = result[0]

      if (reference.length === 0) return Promise.resolve(null)
      if (reference.length > 1) throw new Error(ERRORS.SELECT_REFERENCE_REPOSITORY_FAIL)
      
      const referenceDto: ReferenceDtoInterface = {
        id: reference[0].id,
        signature: reference[0].signature,
        usage: reference[0].usage ? reference[0].usage : null,
        createdAt: new Date(reference[0].created_at),
        updatedAt: new Date(reference[0].updated_at),
        revokedAt: reference[0].revoked_at ? new Date(reference[0].revoked_at) : null
      }

      const referenceResult =  new Reference(referenceDto)
      return Promise.resolve(referenceResult)

    } catch (error) {
      this.service.loggerService.error(ERRORS.SELECT_REFERENCE_REPOSITORY_FAIL)
      throw new Error(ERRORS.SELECT_REFERENCE_REPOSITORY_FAIL, { cause: error })
    }
  }

  async selectReferenceList(): Promise<Reference|null[]> {
    try {
      const selectQuery = `
      SELECT * FROM \`reference\`
        WHERE (revoked_at IS NULL OR revoked_at > NOW())`
      const result: any = await this.database.promise().query(selectQuery)
      const referenceList = result[0]

      const referenceListResult:Reference|null[] = referenceList.map((reference: any) => {
        const referenceDto: ReferenceDtoInterface = {
          id: reference.id,
          signature: reference.signature,
          usage: reference.usage ? reference.usage : null,
          createdAt: new Date(reference.created_at),
          updatedAt: new Date(reference.updated_at),
          revokedAt: reference.revoked_at ? new Date(reference.revoked_at) : null
        }
        return new Reference(referenceDto)
      })
      return Promise.resolve(referenceListResult)

    } catch (error) {
      this.service.loggerService.error(ERRORS.SELECT_REFERENCE_LIST_REPOSITORY_FAIL)
      throw new Error(ERRORS.SELECT_REFERENCE_LIST_REPOSITORY_FAIL, { cause: error })
    }
  }


  async selectReferenceListWhere(dto: selectReferenceListWhereDtoInterface): Promise<Reference[]> {
    try {
      const whereClauses: string[] = []
      const params: any[] = []
  
      dto.where.forEach((condition) => {
        const clause = `${condition.logicalOperator} \`${condition.key}\` ${condition.comparisonOperator} ?`
        whereClauses.push(clause)
        params.push(condition.value)
      })
  
      const whereString = whereClauses.join(' ')
      const selectQuery = `
        SELECT * FROM \`reference\`
          WHERE (revoked_at IS NULL OR revoked_at > NOW()) ${whereString}`
      const result: any = await this.database.promise().query(selectQuery, params)
      const referenceList = result[0]

      const referenceListResult:Reference[] = referenceList.map((reference: any) => {
        const referenceDto: ReferenceDtoInterface = {
          id: reference.id,
          signature: reference.signature,
          usage: reference.usage ? reference.usage : null,
          createdAt: new Date(reference.created_at),
          updatedAt: new Date(reference.updated_at),
          revokedAt: reference.revoked_at ? new Date(reference.revoked_at) : null
        }
        return new Reference(referenceDto)
      })
      
      return Promise.resolve(referenceListResult)

    } catch (error) {
      this.service.loggerService.error(ERRORS.SELECT_REFERENCE_LIST_WHERE_REPOSITORY_FAIL)
      throw new Error(ERRORS.SELECT_REFERENCE_LIST_WHERE_REPOSITORY_FAIL, { cause: error })
    }
  }


  async updateReference(dto: updateReferenceDtoInterface): Promise<Reference> {
    try {
      const updates: string[] = []
      const params: any[] = []

      if (dto.signature) {
        updates.push("\`signature\` = ?")
        params.push(dto.signature)
      }

      if (updates.length === 0) throw new Error(ERRORS.NO_FIELDS_TO_UPDATE)

      const updateQuery = `
        UPDATE \`reference\` SET ${updates.join(", ")} 
        WHERE id = ? 
          AND (revoked_at IS NULL OR revoked_at > NOW())`
      params.push(dto.id)
      const result: any = await this.database.promise().query(updateQuery, params)

      const referenceResult: Reference | null = await this.selectReference({ id: dto.id })
      if(!referenceResult){
        this.service.loggerService.error(ERRORS.UPDATE_REFERENCE_REPOSITORY_FAIL)
        throw new Error(ERRORS.UPDATE_REFERENCE_REPOSITORY_FAIL)
      }
      
      return Promise.resolve(referenceResult)

    } catch (error) {
      this.service.loggerService.error(ERRORS.UPDATE_REFERENCE_REPOSITORY_FAIL)
      throw new Error(ERRORS.UPDATE_REFERENCE_REPOSITORY_FAIL, { cause: error })
    }
  }

  async deleteReference(dto: deleteReferenceDtoInterface): Promise<boolean> {
    try {
      const deleteQuery = `
        DELETE FROM \`reference\`
        WHERE id = ?`
      const result: any = await this.database.promise().query(deleteQuery, [dto.id])

      return Promise.resolve(true)
      
    } catch (error) {
      this.service.loggerService.error(ERRORS.DELETE_REFERENCE_REPOSITORY_FAIL)
      throw new Error(ERRORS.DELETE_REFERENCE_REPOSITORY_FAIL, { cause: error })
    }
  }
}