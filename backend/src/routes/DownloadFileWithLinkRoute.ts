import { Router } from "express"

import { Service } from "@src/services/service"
import { Repository } from "@src/repositories/Repository"
import { downloadFileWithLinkSchema } from "@src/schemas/downloadFileWithLinkSchema"
import { DownloadFileWithLink } from "@src/controllers/download/DownloadFileWithLink"


export class DownloadFileWithLinkRoute {
  router: Router = Router();
  downloadFileWithLink: DownloadFileWithLink

  constructor(repository : Repository, service: Service){
    this.downloadFileWithLink = new DownloadFileWithLink(repository, service)

    this.router.get("/", downloadFileWithLinkSchema, this.downloadFileWithLink.execute);
  }
}
