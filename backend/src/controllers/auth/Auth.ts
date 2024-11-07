import jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"
import { Request, Response } from "express"
import { validationResult } from "express-validator"
import { Repository } from "@src/repositories/Repository"

import ERRORS from "@src/commons/Error"
import { User } from "@src/entities/User"
import { Service } from "@src/services/service"
import { jsonContent } from "@src/types/jsonContent"
import { HASH_SECRET, JWT_SECRET, SESSION_LIFE_TIME } from "@src/commons/config"


export class Auth {
  service: Service
  repository: Repository

  constructor(repository: Repository, service: Service) {
    this.service = service
    this.repository = repository
  }

  execute = async (req: Request, res: Response) => {
    try {
      const error = validationResult(req)
      if (!error.isEmpty()) {
        const result: jsonContent = {
          message: 'Invalid request',
          data: null,
          error: error
        }
        res.status(400).json(result)
        return
      }

      const { login, password } = req.body

      const user: User|null = await this.repository.userRepository.selectUserByLogin({login : login})
      if (!user) {
        this.service.loggerService.error(ERRORS.AUTH_CONTROLLER_FAIL)
        const result: jsonContent = {
          message: 'Invalid request',
          data: null,
          error: ERRORS.AUTH_CONTROLLER_FAIL
        }
        res.status(400).json(result)
        return 
      }

      const isMatch = await bcrypt.compare( HASH_SECRET + password, user.password)
      if (!isMatch) {
        this.service.loggerService.error(ERRORS.AUTH_CONTROLLER_FAIL)
        const result: jsonContent = {
          message: 'Invalid request',
          data: null,
          error: ERRORS.AUTH_CONTROLLER_FAIL
        }
        res.status(400).json(result)
        return 
      }

      const token: string = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: SESSION_LIFE_TIME })

      const result: jsonContent = {
        message: "Request was successful",
        data: { token },
        error: null,
      }
      res.status(200).json(result)

    } catch (error: any) {
      this.service.loggerService.error(ERRORS.AUTH_CONTROLLER_FAIL)
      const result: jsonContent = {
        message: "General server error",
        data: null,
        error: this.service.formatError(error, ERRORS.AUTH_CONTROLLER_FAIL)
      }
      res.status(500).json(result)
    }
  }
}