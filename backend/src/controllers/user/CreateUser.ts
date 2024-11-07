import jwt from 'jsonwebtoken'
import * as bcrypt from "bcryptjs"
import { Request, Response } from "express"
import { validationResult } from "express-validator"

import ERRORS from "@src/commons/Error"
import { Service } from "@src/services/service"
import { jsonContent } from "@src/types/jsonContent"
import { Repository } from "@src/repositories/Repository"
import { insertUserDtoInterface } from "@src/repositories/UserRepository"
import { HASH_SECRET, JWT_SECRET, SESSION_LIFE_TIME } from "@src/commons/config"


export class CreateUser {
  repository: Repository
  service: Service

  constructor(repository: Repository, service: Service) {
    this.repository = repository
    this.service = service
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
 
      const login = req.body.login
      const password = req.body.password

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(HASH_SECRET + password , salt)

      const dto: insertUserDtoInterface = {
        login: login,
        password: hashedPassword,
      }

      const newUser = await this.repository.userRepository.insertUser(dto)
      const payload = {
        userId: newUser.id
      }
      const token: string = jwt.sign(payload, JWT_SECRET, { expiresIn: SESSION_LIFE_TIME })

      const result: jsonContent = {
        message: "Resource successfully created",
        data: {
          user: newUser, 
          token: token
        },
        error: null,
      }
      res.status(201).json(result)
      
    } catch (error: any) {
      this.service.loggerService.error(ERRORS.CREATE_USER_CONTROLLER_FAIL)
      const result: jsonContent = {
        message: "General server error",
        data: null,
        error: this.service.formatError(error, ERRORS.CREATE_USER_CONTROLLER_FAIL)
      }
      res.status(500).json(result)
    }
  }
}
