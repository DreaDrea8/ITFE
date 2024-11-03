import { Router, Request, Response } from "express"

import { FileRoute } from "./FileRoute"
import { UserRoute } from "./UserRoute"
import { Service } from "@src/services/service"
import { Repository } from "@src/repositories/Repository"
import { LinkRoute } from "./LinkRoute"
import { DownloadWithLinkRoute } from "./DownloadWithLinkRoute"

export class Routes {
  router:Router = Router()
  userRoute: UserRoute
  fileRoute: FileRoute
  linkRoute: LinkRoute
  downloadWithLinkRoute: DownloadWithLinkRoute

  constructor(repository: Repository, service: Service){
    this.userRoute = new UserRoute(repository)
    this.fileRoute = new FileRoute(repository, service)
    this.linkRoute = new LinkRoute(repository, service)
    this.downloadWithLinkRoute = new DownloadWithLinkRoute(repository, service)

    this.router.use("/user", this.userRoute.router)
    this.router.use("/file", this.fileRoute.router)
    this.router.use("/link", this.linkRoute.router)
    this.router.use("/download", this.downloadWithLinkRoute.router)
  }

  private initializeRoutes() {
    this.router.post("/register", async (req: Request, res: Response) => {
      try {
        //await this.registerController.register(req, res);
      } catch (error) {
        res.status(500).json({ message: "An unexpected error occurred." })
      }
    });
  }
}
