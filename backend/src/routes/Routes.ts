import { Router, Request, Response } from "express";
import { UserRoute } from "./userRoute";
import { Repository } from "@src/repositories/Repository";


export class Routes {
  router:Router = Router()
  userRoute: UserRoute

  constructor(repository: Repository){

    this.userRoute = new UserRoute(repository)

    this.router.use("/user", this.userRoute.router);
  }

}



