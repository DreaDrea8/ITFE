import { User, UserDtoInterface } from "@src/entities/User";
import { Connection } from "mysql2";

export class UserRepository {
  database: Connection

  constructor(database: Connection){
    this.database = database
  }

  async getAll():Promise<User[]>{
    let result: User[] = []

    const userDto: UserDtoInterface = {
      id: 0,
      email: "",
      lastname: "",
      firstname: "",
      password: "",
      createAt: new Date(),
      updateAt: new Date()
    }
    result.push(new User(userDto))

    return result
  }
}

