import { Router, Request, Response } from "express";

import { Service } from "@src/services/service";
import { Repository } from "@src/repositories/Repository";
import { DownloadWithLink } from "@src/controllers/download/DownloadWithLink";
import { downloadWithLinkSchema } from "@src/schema/downloadWithLinkSchema";


export class DownloadWithLinkRoute {
  router: Router = Router();
  downloadWithLink: DownloadWithLink

  constructor(repository : Repository, service: Service){
    this.downloadWithLink = new DownloadWithLink(repository, service)

    this.router.get("/", downloadWithLinkSchema, this.downloadWithLink.execute);
  }
}

