import { Connection } from "mysql2"

import ERRORS from "@src/commons/Error"
import { whereInterface } from "./Repository"
import { Service } from "@src/services/service"
import { File, FileDtoInterface } from "@src/entities/File"


export interface insertFileDtoInterface {
  libelle: string
  description?: string
  fileName?: string
  originalFileName: string
  mimetype: string
  size: string
  userId?: number
  referenceId: number
}

export interface selectFileDtoInterface {
  id: number
  userId?: number
}

export interface selectExtendFileDtoInterface {
  id: number
  userId?: number
}

export interface selectFileListWhereDtoInterface {
  where: Array<whereInterface>
}

export interface selectTotalFileSizeByUserDtoInterface {
  userId: number
}

export interface updateFileDtoInterface {
  id: number
  libelle?: string
  description?: string 
  fileName?: string
}

export interface updateRevokedAtFileDtoInterface {
  id: number
}

export interface deleteFileDtoInterface {
  id: number
}

export class FileRepository {
  service: Service
  database: Connection

  constructor(database: Connection, service: Service) {
    this.database = database
    this.service = service
  }

  async insertFile(dto: insertFileDtoInterface): Promise<File> {
    try {
      const insertQuery = `
        INSERT INTO \`file\` (libelle, description, file_name, original_file_name, mimetype, size, user_id, reference_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

      const result: any = await this.database.promise().query(insertQuery, [
        dto.libelle,
        dto.description,
        dto.fileName,
        dto.originalFileName,
        dto.mimetype,
        dto.size,
        dto.userId,
        dto.referenceId
      ])

      const fileResult: File|null = await this.selectFile({id: result[0].insertId})
      if(!fileResult){
        this.service.loggerService.error(ERRORS.INSERT_FILE_REPOSITORY_FAIL_TO_ACCES_FILE)
        throw new Error(ERRORS.INSERT_FILE_REPOSITORY_FAIL_TO_ACCES_FILE)
      }
      
      return Promise.resolve(fileResult)
    } catch (error) {
      this.service.loggerService.error(ERRORS.INSERT_FILE_REPOSITORY_FAIL)
      throw new Error(ERRORS.INSERT_FILE_REPOSITORY_FAIL, { cause: error })
    }
  }

  async selectFile(dto: selectFileDtoInterface): Promise<File|null> {
    try {
      let selectQuery = `
        SELECT id, libelle, description, file_name, original_file_name, mimetype, user_id, reference_id, size, created_at, updated_at, revoked_at
        FROM \`file\`
        WHERE id = ? AND (revoked_at IS NULL OR revoked_at > NOW())`
      const queryParams: (number | string)[] = [dto.id]
  
      if (dto.userId !== undefined) {
        selectQuery += ` AND user_id = ?`
        queryParams.push(dto.userId)
      }

      const result: any = await this.database.promise().query(selectQuery, queryParams)
      const file = result[0]

      if (file.length === 0) return Promise.resolve(null)
      if (file.length > 1) throw new Error(ERRORS.SELECT_FILE_REPOSITORY_FAIL)
      
      const fileDto: FileDtoInterface = {
        id: file[0].id,
        libelle: file[0].libelle,
        description: file[0].description ? file[0].description : null,
        fileName: file[0].file_name ? file[0].file_name : null,
        originalFileName: file[0].original_file_name,
        mimetype: file[0].mimetype,
        userId: file[0].user_id,
        referenceId: file[0].reference_id,
        size: file[0].size,
        createdAt: new Date(file[0].created_at),
        updatedAt: new Date(file[0].updated_at),
        revokedAt: file[0].revoked_at ? new Date(file[0].revoked_at) : null
      }
      const fileResult = new File(fileDto)

      return Promise.resolve(fileResult)

    } catch (error) {
      this.service.loggerService.error(ERRORS.SELECT_FILE_REPOSITORY_FAIL)
      throw new Error(ERRORS.SELECT_FILE_REPOSITORY_FAIL, { cause: error })
    }
  }

  async selectExtendFile(dto: selectExtendFileDtoInterface): Promise<File|null> {
    try {
      let selectQuery = `
        SELECT id, libelle, description, file_name, original_file_name, mimetype, user_id, reference_id, size, created_at, updated_at, revoked_at
        FROM \`file\`
        WHERE id = ?
      `
      const queryParams: (number | string)[] = [dto.id]
  
      if (dto.userId !== undefined) {
        selectQuery += ` AND user_id = ?`
        queryParams.push(dto.userId)
      }

      const result: any = await this.database.promise().query(selectQuery, queryParams)
      const file = result[0]

      if (file.length === 0) return Promise.resolve(null)
      if (file.length > 1) throw new Error(ERRORS.SELECT_EXTEND_FILE_REPOSITORY_FAIL)
      
      const fileDto: FileDtoInterface = {
        id: file[0].id,
        libelle: file[0].libelle,
        description: file[0].description ? file[0].description : null,
        fileName: file[0].file_name ? file[0].file_name : null,
        originalFileName: file[0].original_file_name,
        mimetype: file[0].mimetype,
        userId: file[0].user_id,
        referenceId: file[0].reference_id,
        size: file[0].size,
        createdAt: new Date(file[0].created_at),
        updatedAt: new Date(file[0].updated_at),
        revokedAt: file[0].revoked_at ? new Date(file[0].revoked_at) : null
      }
      const fileResult = new File(fileDto)

      return Promise.resolve(fileResult)

    } catch (error) {
      this.service.loggerService.error(ERRORS.SELECT_EXTEND_FILE_REPOSITORY_FAIL)
      throw new Error(ERRORS.SELECT_EXTEND_FILE_REPOSITORY_FAIL, { cause: error })
    }
  }

  async selectFileList(): Promise<File[]> {
    try {
      let selectQuery = `
      SELECT id, libelle, description, file_name, original_file_name, mimetype, 
            user_id, reference_id, size, created_at, updated_at, revoked_at
      FROM \`file\`
      WHERE (revoked_at IS NULL OR revoked_at > NOW()) 
    `
      const result: any = await this.database.promise().query(selectQuery)
      const fileList = result[0]

      const fileListResult = fileList.map((file: any) => {
        const dto: FileDtoInterface = {
          id: file.id,
          libelle: file.libelle,
          description: file.description ? file.description : null,
          fileName: file.file_name ? file.file_name : null,
          originalFileName: file.original_file_name,
          mimetype: file.mimetype,
          userId: file.user_id,
          referenceId: file.reference_id,
          size: file.size,
          createdAt: new Date(file.created_at),
          updatedAt: new Date(file.updated_at),
          revokedAt: file.revoked_at ? new Date(file.revoked_at) : null
        }
        return new File(dto)
      })
      return Promise.resolve(fileListResult)

    } catch (error) {
      this.service.loggerService.error(ERRORS.SELECT_FILE_LIST_REPOSITORY_FAIL)
      throw new Error(ERRORS.SELECT_FILE_LIST_REPOSITORY_FAIL, { cause: error })
    }
  }

  async selectFileListWhere(dto: selectFileListWhereDtoInterface): Promise<File[]> {
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
      SELECT id, libelle, description, file_name, original_file_name, mimetype, 
            user_id, reference_id, size, created_at, updated_at, revoked_at
      FROM \`file\`
      WHERE (revoked_at IS NULL OR revoked_at > NOW()) ${whereString}`
      const result: any = await this.database.promise().query(selectQuery, params)
      const fileList = result[0]

      const fileListResult = fileList.map((file: any) => {
        const fileDto: FileDtoInterface = {
          id: file.id,
          libelle: file.libelle,
          description: file.description ? file.description : null,
          fileName: file.file_name ? file.file_name : null,
          originalFileName: file.original_file_name,
          mimetype: file.mimetype,
          userId: file.user_id,
          referenceId: file.reference_id,
          size: file.size,
          createdAt: new Date(file.created_at),
          updatedAt: new Date(file.updated_at),
          revokedAt: file.revoked_at ? new Date(file.revoked_at) : null
        }
        return new File(fileDto)
      })

      return Promise.resolve(fileListResult)

    } catch (error) {
      this.service.loggerService.error(ERRORS.SELECT_FILE_LIST_WHERE_REPOSITORY_FAIL)
      throw new Error(ERRORS.SELECT_FILE_LIST_WHERE_REPOSITORY_FAIL, { cause: error })
    }
  }

  async selectTotalFileSizeByUser(dto: selectTotalFileSizeByUserDtoInterface): Promise<number> {
    try {
      let selectQuery = `
        SELECT SUM(size) AS totalSize 
        FROM \`file\`
        WHERE user_id = ? AND (revoked_at IS NULL OR revoked_at > NOW())`
      const queryParams: (number | string)[] = [dto.userId]
      const result: any = await this.database.promise().query(selectQuery, queryParams)
      
      const totalSize = result[0][0]?.totalSize

      return Number(totalSize)
    } catch (error) {
      this.service.loggerService.error(ERRORS.SELECT_TOTAL_FILES_SIZE_BY_USER_REPOSITORY_FAIL)
      throw new Error(ERRORS.SELECT_TOTAL_FILES_SIZE_BY_USER_REPOSITORY_FAIL, { cause: error })
    }
  }

  async updateFile(dto: updateFileDtoInterface): Promise<File> {
    try {
      const updates: string[] = []
      const params: any[] = []

      if (dto.libelle) {
        updates.push("libelle = ?")
        params.push(dto.libelle)
      }
      if (dto.description) {
        updates.push("description = ?")
        params.push(dto.description)
      }
      if (dto.fileName) {
        updates.push("file_name = ?")
        params.push(dto.fileName)
      }

      if (updates.length === 0) throw new Error(ERRORS.NO_FIELDS_TO_UPDATE)

      const updateQuery = `UPDATE file SET ${updates.join(", ")} WHERE id = ?`
      params.push(dto.id)
      await this.database.promise().query(updateQuery, params)

      const fileResult: File|null = await this.selectFile({ id: dto.id })
      if(!fileResult){
        this.service.loggerService.error(ERRORS.UPDATE_FILE_REPOSITORY_FAIL_TO_ACCES_FILE)
        throw new Error(ERRORS.UPDATE_FILE_REPOSITORY_FAIL_TO_ACCES_FILE)
      }

      return Promise.resolve(fileResult)
      
    } catch (error) {
      this.service.loggerService.error(ERRORS.UPDATE_FILE_REPOSITORY_FAIL)
      throw new Error(ERRORS.UPDATE_FILE_REPOSITORY_FAIL, { cause: error })
    }
  }

  async updateRevokedAtFile(dto: updateRevokedAtFileDtoInterface): Promise<boolean> {
    try {
      const updateQuery = `UPDATE file SET revoked_at = NOW() WHERE id = ?`
      const params: any[] = [dto.id]
      await this.database.promise().query(updateQuery, params)
      
      const fileResult: File|null = await this.selectExtendFile({ id: dto.id })
      if(!fileResult){
        this.service.loggerService.error(ERRORS.UPDATE_REVOKED_AT_FILE_REPOSITORY_FAIL_TO_ACCES_FILE)
        throw new Error(ERRORS.UPDATE_REVOKED_AT_FILE_REPOSITORY_FAIL_TO_ACCES_FILE)
      }

      return Promise.resolve(true)
    } catch (error) {
      this.service.loggerService.error(ERRORS.UPDATE_REVOKED_AT_FILE_REPOSITORY_FAIL)
      throw new Error(ERRORS.UPDATE_REVOKED_AT_FILE_REPOSITORY_FAIL, { cause: error })
    }
  }

  async deleteFile(dto: deleteFileDtoInterface): Promise<boolean> {
    try {
      const deleteQuery = `DELETE FROM file WHERE id = ?`
      await this.database.promise().query(deleteQuery, [dto.id])
      
      return Promise.resolve(true)
    } catch (error) {
      this.service.loggerService.error(ERRORS.DELETE_FILE_REPOSITORY_FAIL)
      throw new Error(ERRORS.DELETE_FILE_REPOSITORY_FAIL, { cause: error })
    }
  }
}
