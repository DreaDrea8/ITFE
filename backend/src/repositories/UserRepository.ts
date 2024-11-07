import { Connection } from "mysql2"

import ERRORS from "@src/commons/Error"
import { Service } from "@src/services/service"
import { User, userRoleEnum } from "@src/entities/User"


export interface insertUserDtoInterface {
  login: string
  password: string 
  role?: userRoleEnum
}

export interface selectUserByIdDtoInterface {
  id: number
}

export interface selectUserByLoginDtoInterface {
  login: string
}

export class UserRepository {
  service: Service
  database: Connection

  constructor(database: Connection, service: Service) {
    this.service = service
    this.database = database
  }

  async insertUser(dto: insertUserDtoInterface): Promise<User> {
    try {
      const existingUser = await this.selectUserByLogin({ login: dto.login })
      if (existingUser) {
        this.service.loggerService.error(ERRORS.INSERT_USER_REPOSITORY_FAIL_USER_ALREADY_EXIT)
        throw new Error(ERRORS.INSERT_USER_REPOSITORY_FAIL_USER_ALREADY_EXIT)
      }

      const role = dto.role ? dto.role : userRoleEnum.USER
      const insertQuery = `
        INSERT INTO user (login, password, role) 
        VALUES (?, ?, ?)`
      const result: any = await this.database.promise().query(insertQuery, [dto.login, dto.password, role])

      const user: User|null = await this.selectUserById({id: result[0].insertId})
      if(!user){
        this.service.loggerService.error(ERRORS.INSERT_USER_REPOSITORY_FAIL_TO_ACCES_USER)
        throw new Error(ERRORS.INSERT_USER_REPOSITORY_FAIL_TO_ACCES_USER)
      }

      return Promise.resolve(user)

    } catch (error) {
      this.service.loggerService.error(ERRORS.INSERT_USER_REPOSITORY_FAIL)
      throw new Error(ERRORS.INSERT_USER_REPOSITORY_FAIL, { cause: error })
    }
  }

  async selectUserByLogin (dto: selectUserByLoginDtoInterface): Promise<User|null> {
    try {
      const selectQuery = `
        SELECT id, login, password, role, created_at, updated_at
        FROM \`user\`
        WHERE login = ?
          AND (revoked_at IS NULL OR revoked_at > NOW())`
      const result: any = await this.database.promise().query(selectQuery, [dto.login])
      const user = result[0]

      if (user.length !== 1) return Promise.resolve(null)
  
      const userResult: User = new User({
        id: user[0].id,
        login: user[0].login,
        password: user[0].password,
        role: user[0].role,
        createdAt: new Date(user[0].created_at),
        updatedAt: new Date(user[0].updated_at),
        revokedAt: user[0].revoked_at ? new Date(user[0].revoked_at) : null
      })
  
      return Promise.resolve(userResult)
      
    } catch (error) {
      this.service.loggerService.error(ERRORS.SELECT_USER_BY_LOGIN_REPOSITORY_FAIL)
      throw new Error(ERRORS.SELECT_USER_BY_LOGIN_REPOSITORY_FAIL, { cause: error })
    }
  }

  async selectUserById (dto: selectUserByIdDtoInterface): Promise<User|null> {
    try {
      const selectQuery = `
        SELECT id, login, password, role, created_at, updated_at
        FROM \`user\`
        WHERE id = ?
          AND (revoked_at IS NULL OR revoked_at > NOW())`
      const result: any = await this.database.promise().query(selectQuery, [dto.id])
      const user = result[0]

      if (user.length !== 1) return Promise.resolve(null)
  
      const userResult = new User({
        id: user[0].id,
        login: user[0].login,
        password: user[0].password,
        role: user[0].role,
        createdAt: new Date(user[0].created_at),
        updatedAt: new Date(user[0].updated_at),
        revokedAt: user[0].revoked_at ? new Date(user[0].revoked_at) : null
      })
  
      return Promise.resolve(userResult)

    } catch (error) {
      this.service.loggerService.error(ERRORS.SELECT_USER_REPOSITORY_FAIL)
      throw new Error(ERRORS.SELECT_USER_REPOSITORY_FAIL, { cause: error })
    }
  }
}