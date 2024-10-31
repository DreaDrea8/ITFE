import { Connection } from "mysql2"

import ERRORS from "@src/commons/Error"
import { File } from "@src/entities/File"
import loggerService from "@src/services/logger/LoggerService"

export class FileRepository {
  database: Connection

  constructor(database: Connection){
    this.database = database
  }

  async addFile(dto:addFileDtoInterface):Promise<File|Error>{
    try {
      // TODO
      const result:any = await 1
      console.log('addFile', result)

      const file = new File(result)
      return file
    } catch (error) {
      loggerService.error(ERRORS.ADD_FILE_REPOSITORY_FAIL)
      throw new Error(ERRORS.ADD_FILE_REPOSITORY_FAIL, {cause:error})
    }
  }
  
  async getFile(dto:getFileDtoInterface):Promise<File|Error>{
    try {
      // TODO
      const result:any = await 1
      console.log('getFileResult', result)
      
      const file = new File(result)
      return file
    } catch (error) {
      loggerService.error(ERRORS.GET_FILE_REPOSITORY_FAIL)
      throw new Error(ERRORS.GET_FILE_REPOSITORY_FAIL, {cause:error})
    }
  }
  
  async getFiles():Promise<File[]|Error>{
    try {
      // TODO
      let files: File[] = []
      const result:any = await 1
      console.log('getAllFileResult', result)
      
      result.forEach(file => {
        console.log('getAllFileFile', file)
        files.push(new File(file))
      });
      
      return files
    } catch (error) {
      loggerService.error(ERRORS.GET_FILES_REPOSITORY_FAIL)
      throw new Error(ERRORS.GET_FILES_REPOSITORY_FAIL, {cause:error})
    }
  }

  async patchFile(dto:patchFileDtoInterface):Promise<File|Error>{
    try {
      // TODO
      const result:any = await 1
      console.log('patchFileResult', result)
    
      const file = new File(result)
      return file
    } catch (error) {
      loggerService.error(ERRORS.PATCH_FILE_REPOSITORY_FAIL)
      throw new Error(ERRORS.PATCH_FILE_REPOSITORY_FAIL, {cause:error})
    }
  }

  async removeFile(dto:removeFileDtoInterface):Promise<boolean|Error>{
    try {
      // TODO
      const result:any = await 1
      console.log('removeFileResult', result)
    
      return true
    } catch (error) {
      loggerService.error(ERRORS.REMOVE_FILE_REPOSITORY_FAIL)
      throw new Error(ERRORS.REMOVE_FILE_REPOSITORY_FAIL, {cause:error})
    }
  }

}

export interface addFileDtoInterface {
  title: string
  description: string 
  userId: string
  reference: string
  signature: string
  size: string
}

export interface getFileDtoInterface {
  id: number
}

export interface patchFileDtoInterface {
  id: number
  title?: string
  description?: string 
  userId?: string
  reference?: string
  signature?: string
  size?: string
}

export interface removeFileDtoInterface {
  id: number
}