import multer from "multer"
import { Response } from "express"
import { validationResult } from "express-validator"

import ERRORS from "@src/commons/Error"
import { User } from "@src/entities/User"
import { Service } from "@src/services/service"
import { MAX_SIZE_USER } from "@src/commons/config"
import { Reference } from "@src/entities/Reference"
import { jsonContent } from "@src/types/jsonContent"
import { insertFileDtoInterface } from "@src/repositories/FileRepository"
import { insertReferenceDtoInterface, selectReferenceListWhereDtoInterface } from "@src/repositories/ReferenceRepository"
import { comparisonOperatorEnum, logicalOperatorEnum, referenceKeyEnum, Repository, whereInterface } from "@src/repositories/Repository"


const upload = multer({ dest: "tmp/" })

export class CreateFile {
  repository: Repository
  service: Service

  constructor(repository: Repository, service: Service) {
    this.repository = repository
    this.service = service
  }

  execute = async (req: any, res: Response) => {
    try {
      const curentUser: User | undefined = req.user 
      if(!curentUser){
        throw new Error(ERRORS.CURRENT_USER_NOT_FOUND)
      }

      const error = validationResult(req)
      if (!error.isEmpty()) {
        const result: jsonContent = {
          message: 'Invalid request',
          data: null,
          error: error
        }
        this.service.fileSystemService.deleteFile('', 'tmp', req.file.filename)
        res.status(400).json(result)
        return
      }
      
      const libelle = req.body.libelle
      const description = req.body.description
      const file = req.file
      
      const totalSize:number = await this.repository.fileRepository.selectTotalFileSizeByUser({userId: curentUser.id})

      if((req.file.size + totalSize) > MAX_SIZE_USER){
        const result: jsonContent = {
          message: 'Internal Server Error',
          data: null,
          error: ERRORS.CREATE_FILE_CONTROLLER_FAIL_FILE_SIZE_LIMIT_EXCEEDED
        }
        this.service.fileSystemService.deleteFile('', 'tmp', req.file.filename)
        res.status(500).json(result)
        return
      }

      let hash: string

      try {
        hash = await this.service.fileSystemService.hashFile(file.path, '', '')
      } catch (error){
        this.service.loggerService.error(ERRORS.CREATE_FILE_CONTROLLER_FAIL_HASHING_FAIL)
        const result: jsonContent = {
          message: "General server error",
          data: null,
          error: this.service.formatError(error, ERRORS.CREATE_FILE_CONTROLLER_FAIL_HASHING_FAIL)
        }
        res.status(500).json(result)
        return
      }

      const filterBySignature: whereInterface =  {
        logicalOperator: logicalOperatorEnum.AND,
        key: referenceKeyEnum.SIGNATURE,
        comparisonOperator: comparisonOperatorEnum.EQUALS,
        value: hash
      }

      const dto: selectReferenceListWhereDtoInterface = {
        where: [filterBySignature]
      }
      const references:Reference[] = await this.repository.referenceRepository.selectReferenceListWhere(dto)
      
      let reference: Reference
      if(references.length === 0) {
        const insertReferenceDto: insertReferenceDtoInterface = {
          signature : hash, 
          usage: 1
        }
        reference = await this.repository.referenceRepository.insertReference(insertReferenceDto)
        this.service.fileSystemService.renameFile('', 'tmp', file.filename, 'files', `${reference.id}`)
      } else {
        reference = references[0]
        this.service.fileSystemService.deleteFile('', 'tmp', file.filename)
      }

      const addFileDto: insertFileDtoInterface  = {
        libelle: libelle,
        description: description,
        userId: curentUser.id, 
        referenceId: reference.id,
        size: file.size ,
        fileName: file.fieldname,
        originalFileName: file.originalname,
        mimetype: file.mimetype
      }

      const fileResult = await this.repository.fileRepository.insertFile(addFileDto)

      const result: jsonContent = {
        message: "Resource successfully created",
        data: fileResult,
        error: null,
      }
      res.status(201).json(result)

    } catch (error: any) {
      this.service.loggerService.error(ERRORS.CREATE_FILE_CONTROLLER_FAIL)
      const result: jsonContent = {
        message: "General server error",
        data: null,
        error: this.service.formatError(error, ERRORS.CREATE_FILE_CONTROLLER_FAIL)
      }
      res.status(500).json(result)
    }
  }
}

export default upload
