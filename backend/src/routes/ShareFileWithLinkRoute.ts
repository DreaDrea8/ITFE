import { Router } from "express"

import { Service } from "@src/services/service"
import { Repository } from "@src/repositories/Repository"
import { ReadFileWithLink } from "@src/controllers/share/ReadFileWithLink"
import { ShareFileWithLink } from "@src/controllers/share/ShareFileWithLink"
import { readFileWithLinkSchema } from "@src/schemas/readFileWithLinkSchema"
import { shareFileWithLinkSchema } from "@src/schemas/shareFileWithLinkSchema"


export class ShareFileWithLinkRoute {
  router: Router = Router();
  shareFileWithLink: ShareFileWithLink
  readFileWithLink: ReadFileWithLink

  constructor(repository : Repository, service: Service){
    this.shareFileWithLink = new ShareFileWithLink(repository, service)
    this.readFileWithLink = new ReadFileWithLink(repository, service)

    this.router.get("/download", shareFileWithLinkSchema, this.shareFileWithLink.execute);
    this.router.get("/file", readFileWithLinkSchema, this.readFileWithLink.execute);
  }
}
