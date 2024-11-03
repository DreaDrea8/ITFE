import { Router, Request, Response } from "express"

import { Service } from "@src/services/service"
import { createFileSchema } from "@src/schema/createFileSchema"
import { Repository } from "@src/repositories/Repository"
import { getFileSchema } from "@src/schema/getFileSchema"
import { ReadFile } from "@src/controllers/file/ReadFile"
import { ReadFiles } from "@src/controllers/file/ReadFiles"
import { UpdateFile } from "@src/controllers/file/UpdateFile"
import { DeleteFile } from "@src/controllers/file/DeleteFile"
import { updateFileSchema } from "@src/schema/updateFileSchema"
import { deleteFileSchema } from "@src/schema/deleteFileSchema"
import { DownloadFile } from "@src/controllers/file/DownloadFile"
import upload, { CreateFile } from "@src/controllers/file/CreateFile"
import { DeleteHardFile } from "@src/controllers/file/DeleteHardFile"
import { deleteHardFileSchema } from "@src/schema/deleteHardFileSchema"
import { GetTotalSizeFile } from "@src/controllers/file/GetTotalSizeFile"


export class FileRoute {
  router: Router = Router()
  readFile: ReadFile
  readFiles: ReadFiles
  createFile: CreateFile
  updateFile: UpdateFile
  deleteFile: DeleteFile
  downloadFile: DownloadFile
  deleteHardFile: DeleteHardFile
  getTotalSizeFile: GetTotalSizeFile

  constructor(repository : Repository, service: Service){
    this.readFile = new ReadFile(repository, service)
    this.readFiles = new ReadFiles(repository, service)
    this.createFile = new CreateFile(repository, service)
    this.updateFile = new UpdateFile(repository, service)
    this.deleteFile = new DeleteFile(repository, service)
    this.downloadFile = new DownloadFile(repository, service) 
    this.deleteHardFile = new DeleteHardFile(repository, service)
    this.getTotalSizeFile = new GetTotalSizeFile(repository, service) 

    this.router.post("/", upload.single("file"), createFileSchema, this.createFile.execute)
    this.router.get("/", this.readFiles.execute)
    this.router.get("/:file_id(\\d+)",getFileSchema, this.readFile.execute)
    this.router.get("/size", this.getTotalSizeFile.execute)
    this.router.patch("/:file_id(\\d+)", updateFileSchema, this.updateFile.execute)
    this.router.get("/:file_id(\\d+)/download", getFileSchema, this.downloadFile.execute)
    this.router.delete("/:file_id(\\d+)", deleteFileSchema, this.deleteFile.execute)
    this.router.delete("/:file_id(\\d+)/hard", deleteHardFileSchema, this.deleteHardFile.execute)
  }

}

