import { Router } from "express"

import { Service } from "@src/services/service"
import { Repository } from "@src/repositories/Repository"
import { CreateLink } from "@src/controllers/link/CreateLink"
import { createLinkSchema } from "@src/schemas/createLinkSchema"
import { ReadLinkList } from "@src/controllers/link/ReadLinkList"


export class LinkRoute {
  router: Router = Router()
  createLink: CreateLink
  readLinkList: ReadLinkList

  constructor(repository : Repository, service: Service){
    this.createLink = new CreateLink(repository, service)
    this.readLinkList = new ReadLinkList(repository, service)

    this.router.post("/", createLinkSchema, this.createLink.execute)
    this.router.get("/", this.readLinkList.execute)
  }
}

