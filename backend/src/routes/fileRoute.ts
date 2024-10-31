import { Router, Request, Response } from "express";

import { AddFile } from "@src/controllers/file/addFile";
import { GetFile } from "@src/controllers/file/GetFile";
import { Repository } from "@src/repositories/Repository";
import { GetFiles } from "@src/controllers/file/GetFilles";
import { PatchFile } from "@src/controllers/file/PatchFile";
import { RemoveFile } from "@src/controllers/file/RemoveFile";


export class FileRoute {
  router: Router = Router();
  addFile: AddFile
  getFile: GetFile
  getFiles: GetFiles
  patchFile: PatchFile
  removeFile: RemoveFile

  constructor(repository : Repository){
    this.addFile = new AddFile(repository)
    this.getFile = new GetFile(repository)
    this.getFiles = new GetFiles(repository)
    this.patchFile = new PatchFile(repository)
    this.removeFile = new RemoveFile(repository)

    this.router.post("/", this.addFile.execute);
    this.router.get("/", this.getFiles.execute);
    this.router.get("/:id(\\d+)", this.getFile.execute);
    this.router.patch("/", this.patchFile.execute);
    this.router.delete("/:id(\\d+)", this.removeFile.execute);
  }

}

