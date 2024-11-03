import multer from "multer"
import { Request, Response } from "express"
import { validationResult } from "express-validator"

import ERRORS from "@src/commons/Error"
import { Service } from "@src/services/service"
import { Reference } from "@src/entities/Reference"
import { jsonContent } from "@src/types/jsonContent"
import { User, userExemple } from "@src/entities/User"
import { addFileDtoInterface } from "@src/repositories/FileRepository"
import { addReferenceDtoInterface, getReferencesWhereDtoInterface } from "@src/repositories/ReferenceRepository"
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
      const curentUser: User = userExemple //TODO auth
      const MAX_SIZE:number = 2147483648 //2Go
      
      const valid = validationResult(req)
      if (!valid.isEmpty()) {
        const result: jsonContent = {
          message: 'Internal Server Error',
          data: null,
          error: valid
        }
        this.service.fileSystemService.deleteFile('', 'tmp', req.file.filename)
        res.status(500).json(result)
        return
      }
      
      const libelle = req.body.libelle
      const description = req.body.description
      const file = req.file
      
      const totalSize:number = await this.repository.fileRepository.getTotalFileSizeByUser({userId: curentUser.id})
      
      if((req.file.size + totalSize) > MAX_SIZE){
        const result: jsonContent = {
          message: 'Internal Server Error',
          data: null,
          error: ERRORS.FILE_SIZE_LIMIT_EXCEEDED
        }
        this.service.fileSystemService.deleteFile('', 'tmp', req.file.filename)
        res.status(500).json(result)
        return
      }

      const hash = await this.service.fileSystemService.hashFile(file.path, '', '')

      const filterBySignature: whereInterface =  {
        logicalOperator: logicalOperatorEnum.AND,
        key: referenceKeyEnum.SIGNATURE,
        comparisonOperator: comparisonOperatorEnum.EQUALS,
        value: hash
      }

      const dto: getReferencesWhereDtoInterface = {
        where: [filterBySignature]
      }
      const references:Reference[] = await this.repository.referenceRepository.getReferencesWhere(dto)
      
      let reference: Reference
      if(references.length === 0) {
        const addReferenceDto: addReferenceDtoInterface = {
          signature : hash, 
          usage: 1
        }

        reference = await this.repository.referenceRepository.addReference(addReferenceDto)
        this.service.fileSystemService.renameFile('', 'tmp', file.filename, 'files', `${reference.id}`)
      } else {
        reference = references[0]
        this.service.fileSystemService.deleteFile('', 'tmp', file.filename)
      }

      const addFileDto: addFileDtoInterface  = {
        libelle: libelle,
        description: description,
        userId: curentUser.id, 
        referenceId: reference.id,
        size: file.size,
        fileName: file.fieldname,
        originalFileName: file.originalname,
        mimetype: file.mimetype
      }

      const fileResult = await this.repository.fileRepository.addFile(addFileDto)

      const result: jsonContent = {
        message: 'Infos retrieved successfully',
        data: fileResult,
        error: null
      }
      res.status(200).json(result)
    } catch (error: any) {
      this.service.loggerService.error(ERRORS.ADD_FILE_CONTROLLER_FAIL)
      const result: jsonContent = {
        message: 'Internal Server Error',
        data: null,
        error: {
          message: error.message,
          cause: error.cause ? JSON.stringify(error.cause, Object.getOwnPropertyNames(error.cause)) : null,
        }
      }
      res.status(500).json(result)
    }
  }
}

export default upload
