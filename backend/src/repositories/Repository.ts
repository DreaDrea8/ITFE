import { Connection } from "mysql2"

import { UserRepository } from "./UserRepository"
import { FileRepository } from "./FileRepository"

export class Repository {
  database: Connection
  userRepository: UserRepository
  fileRepository: FileRepository

  constructor(database: Connection) {
    this.database = database
    this.userRepository = new UserRepository(this.database)
    this.fileRepository = new FileRepository(this.database)
  }
}
