import { GetAllUser } from "@src/controllers/user/GetAllUser";
import { Repository } from "@src/repositories/Repository";
import { Router, Request, Response } from "express";


export class UserRoute {
  router:Router = Router();
  getAllUser: GetAllUser


  constructor(repository : Repository){
    this.getAllUser = new GetAllUser(repository)
    
    this.router.get("/", this.getAllUser.execute);
  }

}

