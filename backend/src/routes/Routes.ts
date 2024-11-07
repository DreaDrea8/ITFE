import { Router, Request, Response } from "express"

import { AuthRoute } from "./AuthRoute"
import { UserRoute } from "./UserRoute"
import { FileRoute } from "./FileRoute"
import { LinkRoute } from "./LinkRoute"
import ERRORS from "@src/commons/Error"
import { Service } from "@src/services/service"
import { jsonContent } from "@src/types/jsonContent"
import { Repository } from "@src/repositories/Repository"
import { authMiddleware } from "@src/middleware/AuthMiddleware"
import { DownloadFileWithLinkRoute } from "./DownloadFileWithLinkRoute"

export class Routes {
  router:Router = Router()

  service: Service
  authRoute: AuthRoute
  userRoute: UserRoute
  fileRoute: FileRoute
  linkRoute: LinkRoute
  downloadFileWithLinkRoute: DownloadFileWithLinkRoute

  constructor(repository: Repository, service: Service){
    this.service = service

    this.authRoute = new AuthRoute(repository, service)
    this.userRoute = new UserRoute(repository, service)
    this.fileRoute = new FileRoute(repository, service)
    this.linkRoute = new LinkRoute(repository, service)
    this.downloadFileWithLinkRoute = new DownloadFileWithLinkRoute(repository, service)

    this.router.use("/auth", this.authRoute.router)
    this.router.use("/download", this.downloadFileWithLinkRoute.router)
    this.router.use("/user", this.userRoute.router)
    this.router.use("/file", authMiddleware(repository, service), this.fileRoute.router)
    this.router.use("/link", authMiddleware(repository, service), this.linkRoute.router)

    this.router.use('*', (req: Request, res: Response) => {
			this.service.loggerService.error(ERRORS.ROUTE_NOT_FOUND)
      const result: jsonContent = {
        message: "Resource not found",
        data: null,
        error: this.service.formatError( '', ERRORS.ROUTE_NOT_FOUND)
      }
      res.status(404).json(result)
      return 
		})
  }
}
