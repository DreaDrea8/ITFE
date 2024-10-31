import { Connection } from "mysql2";
import { UserRepository } from "./UserRepository";

export class Repository {
  database: Connection;
  public userRepository: UserRepository;

  constructor(database: Connection) {
    this.database = database;
    this.userRepository = new UserRepository(this.database);
  }
}
