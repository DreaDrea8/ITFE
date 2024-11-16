import { Connection } from "mysql2"

import { Service } from "@src/services/service"
import { UserRepository } from "./UserRepository"
import { FileRepository } from "./FileRepository"
import { LinkRepository } from "./LinkRepository"
import { ReferenceRepository } from "./ReferenceRepository"

export class Repository {
  service: Service
  database: Connection
  userRepository: UserRepository
  fileRepository: FileRepository
  linkRepository: LinkRepository
  referenceRepository: ReferenceRepository

  constructor(database: Connection, service: Service) {
    this.service = service
    this.database = database

    this.userRepository = new UserRepository(this.database, this.service)
    this.fileRepository = new FileRepository(this.database, this.service)
    this.linkRepository = new LinkRepository(this.database, this.service)
    this.referenceRepository = new ReferenceRepository(this.database, this.service)
  }
}

export enum comparisonOperatorEnum {
  EQUALS = '=',
  NOT_EQUALS = '!=',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  GREATER_THAN_OR_EQUALS = '>=',
  LESS_THAN_OR_EQUALS = '<=',
  LIKE = 'LIKE',
  IN = 'IN'
}

export enum logicalOperatorEnum {
  AND = 'AND',
  OR = 'OR'
}

export enum referenceKeyEnum {
  ID = 'id', 
  SIGNATURE = 'signature',
  USAGE = 'usage', 
  CREATE_DAT = "created_at",
  UPDATED_AT = "updated_at"
}

export enum fileKeyEnum {
  ID = 'id', 
  LIBELLE = 'libelle',
  DESCRIPTION = 'description', 
  FILE_NAME = 'file_name', 
  ORIGINAL_FILE_NAME = 'original_file_name', 
  MIMETYPE = 'mimetype', 
  USER_ID = 'user_id', 
  REFERENCE_ID = 'reference_id', 
  SIZE = 'size', 
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
  DELETED_AT = "deleted_at"
}

export enum linkKeyEnum {
  ID = 'id', 
  USER_ID = 'user_id', 
  FILE_ID = 'file_id', 
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
  EXPIRED_AT = "expired_at"
}


export interface whereInterface {
  logicalOperator: logicalOperatorEnum
  key: referenceKeyEnum | fileKeyEnum | linkKeyEnum
  comparisonOperator: comparisonOperatorEnum
  value: string
}