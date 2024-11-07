import { Router } from "express"

import { Service } from "@src/services/service"
import { ReadFile } from "@src/controllers/file/ReadFile"
import { Repository } from "@src/repositories/Repository"
import { getFileSchema } from "@src/schemas/getFileSchema"
import { UpdateFile } from "@src/controllers/file/UpdateFile"
import { DeleteFile } from "@src/controllers/file/DeleteFile"
import { createFileSchema } from "@src/schemas/createFileSchema"
import { updateFileSchema } from "@src/schemas/updateFileSchema"
import { deleteFileSchema } from "@src/schemas/deleteFileSchema"
import { DownloadFile } from "@src/controllers/file/DownloadFile"
import { ReadFileList } from "@src/controllers/file/ReadFileList"
import { DeleteHardFile } from "@src/controllers/file/DeleteHardFile"
import upload, { CreateFile } from "@src/controllers/file/CreateFile"
import { deleteHardFileSchema } from "@src/schemas/deleteHardFileSchema"
import { ReadTotalSizeFile } from "@src/controllers/file/ReadTotalSizeFile"


export class FileRoute {
  router: Router = Router()

  readFile: ReadFile
  createFile: CreateFile
  updateFile: UpdateFile
  deleteFile: DeleteFile
  readFileList: ReadFileList
  downloadFile: DownloadFile
  deleteHardFile: DeleteHardFile
  readTotalSizeFile: ReadTotalSizeFile

  constructor(repository : Repository, service: Service){
    this.readFile = new ReadFile(repository, service)
    this.createFile = new CreateFile(repository, service)
    this.updateFile = new UpdateFile(repository, service)
    this.deleteFile = new DeleteFile(repository, service)
    this.downloadFile = new DownloadFile(repository, service) 
    this.readFileList = new ReadFileList(repository, service)
    this.deleteHardFile = new DeleteHardFile(repository, service)
    this.readTotalSizeFile = new ReadTotalSizeFile(repository, service) 

    this.router.post("/", upload.single("file"), createFileSchema, this.createFile.execute)
    this.router.get("/", this.readFileList.execute)
    this.router.get("/:file_id(\\d+)",getFileSchema, this.readFile.execute)
    this.router.get("/size", this.readTotalSizeFile.execute)
    this.router.patch("/:file_id(\\d+)", updateFileSchema, this.updateFile.execute)
    this.router.get("/:file_id(\\d+)/download", getFileSchema, this.downloadFile.execute)
    this.router.delete("/:file_id(\\d+)", deleteFileSchema, this.deleteFile.execute)
    this.router.delete("/:file_id(\\d+)/hard", deleteHardFileSchema, this.deleteHardFile.execute)
  }

}

