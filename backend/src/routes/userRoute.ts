import { Router, Request, Response } from "express";

import { Repository } from "@src/repositories/Repository"
import { GetAllUser } from "@src/controllers/user/GetAllUser"

import { AddUser } from "@src/controllers/user/AddUser";

export class UserRoute {
  router: Router = Router();
  getAllUser: GetAllUser;
  addUser: AddUser;

  constructor(repository: Repository) {
    console.log("userRoute");
    this.getAllUser = new GetAllUser(repository);
    this.addUser = new AddUser(repository);

    this.router.get("/", this.getAllUser.execute);
    this.router.post("/", this.addUser.execute);
  }
}
