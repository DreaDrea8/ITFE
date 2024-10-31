import { Router, Request, Response } from "express"

import { FileRoute } from "./fileRoute"
import { UserRoute } from "./userRoute"
import { Repository } from "@src/repositories/Repository"


export class Routes {
  router:Router = Router()
  userRoute: UserRoute
  fileRoute: FileRoute

  constructor(repository: Repository){

    this.userRoute = new UserRoute(repository)
    this.fileRoute = new FileRoute(repository)

    this.router.use("/user", this.userRoute.router)
    this.router.use("/file", this.fileRoute.router)
  }

}



