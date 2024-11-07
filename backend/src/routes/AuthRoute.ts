import { Router } from "express"

import { Service } from "@src/services/service"
import { Auth } from "@src/controllers/auth/Auth"
import { authSchema } from "@src/schemas/authSchema"
import { Repository } from "@src/repositories/Repository"

export class AuthRoute {
  router: Router = Router()
  auth: Auth

  constructor(repository : Repository, service: Service) {
    this.auth = new Auth(repository, service)

    this.router.post("/", authSchema, this.auth.execute)
  }
}
