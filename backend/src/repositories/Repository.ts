import { Connection } from "mysql2"
import { UserRepository } from "./UserRepository"

export class Repository {
  database: Connection
  userRepository: UserRepository

  constructor(database: Connection) {
    this.database = database
    this.userRepository = new UserRepository(this.database)

  }
}

