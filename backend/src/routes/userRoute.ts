import { Router } from "express"

import { Service } from "@src/services/service"
import { Repository } from "@src/repositories/Repository"
import { CreateUser } from "@src/controllers/user/CreateUser"
import { createUserSchema } from "@src/schemas/createUserSchema"


export class UserRoute {
  router: Router = Router()
  createUser: CreateUser

  constructor(repository : Repository, service: Service) {
    this.createUser = new CreateUser(repository, service)

    this.router.post("/", createUserSchema, this.createUser.execute)
  }
}
