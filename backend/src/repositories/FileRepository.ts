import { Connection } from "mysql2"

import ERRORS from "@src/commons/Error"
import { File, FileDtoInterface } from "@src/entities/File"
import loggerService from "@src/services/logger/LoggerService"
import { whereInterface } from "./Repository"
import { Service } from "@src/services/service"

export class FileRepository {
  service: Service
  database: Connection;

  constructor(database: Connection, service: Service) {
    this.database = database;
    this.service = service
  }

  async addFile(dto: addFileDtoInterface): Promise<File> {
    try {
      const insertQuery = `
        INSERT INTO \`file\` (
          libelle,
          description,
          file_name,
          original_file_name,
          mimetype,
          size,
          user_id,
          reference_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result: any = await this.database.promise().query(insertQuery, [
        dto.libelle,
        dto.description,
        dto.fileName,
        dto.originalFileName,
        dto.mimetype,
        dto.size,
        dto.userId,
        dto.referenceId
      ]);
      const file = await this.getFile({id: result[0].insertId})

      return file;
    } catch (error) {
      loggerService.error(ERRORS.ADD_FILE_REPOSITORY_FAIL);
      throw new Error(ERRORS.ADD_FILE_REPOSITORY_FAIL, { cause: error });
    }
  }

  async getFile(dto: getFileDtoInterface): Promise<File> {
    try {
      let selectQuery = `
        SELECT id, libelle, description, file_name, original_file_name, mimetype, 
              user_id, reference_id, size, created_at, updated_at, deleted_at
        FROM \`file\`
        WHERE id = ? AND (deleted_at IS NULL OR deleted_at > NOW()) 
      `;
      const queryParams: (number | string)[] = [dto.id];
  
      if (dto.userId !== undefined) {
        selectQuery += ` AND user_id = ?`;
        queryParams.push(dto.userId);
      }

      const result: any = await this.database.promise().query(selectQuery, queryParams);
      const resultFile = result[0]
      
      if (resultFile.length === 0) throw new Error(ERRORS.FILE_NOT_FOUND, {cause: {result}});
      if (resultFile.length !== 1) throw new Error(ERRORS.FILE_NOT_FOUND, {cause: {result}});
      
      const fileDto: FileDtoInterface = {
        id: resultFile[0].id,
        libelle: resultFile[0].libelle,
        description: resultFile[0].description,
        fileName: resultFile[0].file_name,
        originalFileName: resultFile[0].original_file_name,
        mimetype: resultFile[0].mimetype,
        userId: resultFile[0].user_id,
        referenceId: resultFile[0].reference_id,
        size: resultFile[0].size,
        createdAt: new Date(resultFile[0].created_at),
        updatedAt: new Date(resultFile[0].updated_at),
        deletedAt: new Date(resultFile[0].deleted_at)
      }

      const file = new File(fileDto);
      return file;
    } catch (error) {
      this.service.loggerService.error(ERRORS.GET_FILE_REPOSITORY_FAIL);
      throw new Error(ERRORS.GET_FILE_REPOSITORY_FAIL, { cause: error });
    }
  }

  async getExtendFile(dto: getExtendFileDtoInterface): Promise<File> {
    try {
      let selectQuery = `
        SELECT id, libelle, description, file_name, original_file_name, mimetype, 
              user_id, reference_id, size, created_at, updated_at, deleted_at
        FROM \`file\`
        WHERE id = ?
      `;
      const queryParams: (number | string)[] = [dto.id];
  
      if (dto.userId !== undefined) {
        selectQuery += ` AND user_id = ?`;
        queryParams.push(dto.userId);
      }

      const result: any = await this.database.promise().query(selectQuery, queryParams);
      const resultFile = result[0]
      
      if (resultFile.length === 0) throw new Error(ERRORS.FILE_NOT_FOUND, {cause: {result}});
      if (resultFile.length !== 1) throw new Error(ERRORS.FILE_NOT_FOUND, {cause: {result}});
      
      const fileDto: FileDtoInterface = {
        id: resultFile[0].id,
        libelle: resultFile[0].libelle,
        description: resultFile[0].description,
        fileName: resultFile[0].file_name,
        originalFileName: resultFile[0].original_file_name,
        mimetype: resultFile[0].mimetype,
        userId: resultFile[0].user_id,
        referenceId: resultFile[0].reference_id,
        size: resultFile[0].size,
        createdAt: new Date(resultFile[0].created_at),
        updatedAt: new Date(resultFile[0].updated_at),
        deletedAt: new Date(resultFile[0].deleted_at)
      }

      const file = new File(fileDto);
      return file;
    } catch (error) {
      this.service.loggerService.error(ERRORS.GET_FILE_REPOSITORY_FAIL);
      throw new Error(ERRORS.GET_FILE_REPOSITORY_FAIL, { cause: error });
    }
  }

  async getFiles(): Promise<File[]> {
    try {
      let selectQuery = `
      SELECT id, libelle, description, file_name, original_file_name, mimetype, 
            user_id, reference_id, size, created_at, updated_at, deleted_at
      FROM \`file\`
      WHERE (deleted_at IS NULL OR deleted_at > NOW()) 
    `;
      const result: any = await this.database.promise().query(selectQuery);
      const rows = result[0]

      const files = rows.map((row: any) => {
        const dto: FileDtoInterface = {
          id: row.id,
          libelle: row.libelle,
          description: row.description ?? '',
          fileName: row.file_name,
          originalFileName: row.original_file_name,
          mimetype: row.mimetype,
          userId: row.user_id,
          referenceId: row.reference_id,
          size: row.size,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
          deletedAt: new Date(row.deleted_at)
        }
        return new File(dto)
      });
      return files;
    } catch (error) {
      this.service.loggerService.error(ERRORS.GET_FILES_REPOSITORY_FAIL);
      throw new Error(ERRORS.GET_FILES_REPOSITORY_FAIL, { cause: error });
    }
  }

  async getFilesWhere(dto: getFilesWhereDtoInterface): Promise<File[]> {
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
      SELECT id, libelle, description, file_name, original_file_name, mimetype, 
            user_id, reference_id, size, created_at, updated_at, deleted_at
      FROM \`file\`
      WHERE 1 = 1 AND (deleted_at IS NULL OR deleted_at > NOW()) ${whereString}`;
      const result: any = await this.database.promise().query(selectQuery, params);
      const rows = result[0]

      const files = rows.map((row: any) => {
        const dto: FileDtoInterface = {
          id: row.id,
          libelle: row.libelle,
          description: row.description ?? '',
          fileName: row.file_name,
          originalFileName: row.original_file_name,
          mimetype: row.mimetype,
          userId: row.user_id,
          referenceId: row.reference_id,
          size: row.size,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at), 
          deletedAt: new Date(row.deleted_at), 
        }
        return new File(dto)
      });
      return files;
    } catch (error) {
      this.service.loggerService.error(ERRORS.GET_FILE_WHERE_REPOSITORY_FAIL);
      throw new Error(ERRORS.GET_FILE_WHERE_REPOSITORY_FAIL, { cause: error });
    }
  }

  async getTotalFileSizeByUser(dto: getTotalFileSizeByUserDtoInterface): Promise<number> {
    try {
      let selectQuery = `SELECT SUM(size) AS totalSize FROM \`file\` WHERE user_id = ?`;
      const queryParams: (number | string)[] = [dto.userId];
      const result: any = await this.database.promise().query(selectQuery, queryParams);
      
      const totalSize = result[0][0]?.totalSize;
      return Number(totalSize) || 0;
    } catch (error) {
      this.service.loggerService.error(ERRORS.GET_TOTAL_FILES_SIZE_BY_USER_REPOSITORY_FAIL);
      throw new Error(ERRORS.GET_TOTAL_FILES_SIZE_BY_USER_REPOSITORY_FAIL, { cause: error });
    }
  }

  async patchFile(dto: patchFileDtoInterface): Promise<File> {
    try {
      const updates: string[] = [];
      const params: any[] = [];

      if (dto.libelle) {
        updates.push("libelle = ?");
        params.push(dto.libelle);
      }
      if (dto.description) {
        updates.push("description = ?");
        params.push(dto.description);
      }
      if (dto.fileName) {
        updates.push("file_name = ?");
        params.push(dto.fileName);
      }

      if (updates.length === 0) throw new Error(ERRORS.NO_FIELDS_TO_UPDATE);

      const updateQuery = `UPDATE file SET ${updates.join(", ")} WHERE id = ?`;
      params.push(dto.id);
      await this.database.promise().query(updateQuery, params);

      return await this.getFile({ id: dto.id });
    } catch (error) {
      loggerService.error(ERRORS.PATCH_FILE_REPOSITORY_FAIL);
      throw new Error(ERRORS.PATCH_FILE_REPOSITORY_FAIL, { cause: error });
    }
  }

  async removeFile(dto: removeFileDtoInterface): Promise<boolean> {
    try {
      const updateQuery = `UPDATE file SET deleted_at = NOW() WHERE id = ?`;
      const params: any[] = [dto.id]
      await this.database.promise().query(updateQuery, params);
      
      return true;
    } catch (error) {
      loggerService.error(ERRORS.REMOVE_FILE_REPOSITORY_FAIL);
      throw new Error(ERRORS.REMOVE_FILE_REPOSITORY_FAIL, { cause: error });
    }
  }


  async removeHardFile(dto: removeHardFileDtoInterface): Promise<boolean> {
    try {
      const deleteQuery = `DELETE FROM file WHERE id = ?`;
      await this.database.promise().query(deleteQuery, [dto.id]);
      
      return true;
    } catch (error) {
      loggerService.error(ERRORS.REMOVE_HARD_FILE_REPOSITORY_FAIL);
      throw new Error(ERRORS.REMOVE_HARD_FILE_REPOSITORY_FAIL, { cause: error });
    }
  }

}

export interface addFileDtoInterface {
  libelle: string
  description?: string
  fileName?: string
  originalFileName?: string
  mimetype?: string
  size: string
  userId?: number
  referenceId: number
}

export interface getFileDtoInterface {
  id: number
  userId?: number
}

export interface getExtendFileDtoInterface {
  id: number
  userId?: number
}

export interface getFilesWhereDtoInterface {
  where: Array<whereInterface>
}

export interface getTotalFileSizeByUserDtoInterface {
  userId: number
}

export interface patchFileDtoInterface {
  id: number
  libelle?: string
  description?: string 
  fileName?: string
}

export interface removeFileDtoInterface {
  id: number
}

export interface removeHardFileDtoInterface {
  id: number
}
