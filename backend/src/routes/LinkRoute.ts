import { Router, Request, Response } from "express";

import { Service } from "@src/services/service";
import { Repository } from "@src/repositories/Repository";
import { CreateLink } from "@src/controllers/link/CreateLink";
import { createLinkSchema } from "@src/schema/createLinkSchema";


export class LinkRoute {
  router: Router = Router();
  createLink: CreateLink

  constructor(repository : Repository, service: Service){
    this.createLink = new CreateLink(repository, service)

    this.router.post("/", createLinkSchema, this.createLink.execute);
  }
}

