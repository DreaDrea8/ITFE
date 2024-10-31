import { Connection } from "mysql2"

import { User, UserDtoInterface } from "@src/entities/User"

export class UserRepository {
  database: Connection;

  constructor(database: Connection) {
    this.database = database;
  }

  async getAll(): Promise<User[]> {
    let result: User[] = [];

    const userDto: UserDtoInterface = {
      id: 0,
      login: "",
      password: "",
      created_at: new Date(),
      updated_at: new Date(),
    };
    result.push(new User(userDto));

    return result;
  }

  //Create user in database
  async createUser(login: string, password: string): Promise<User | null> {
    const existingUser = await this.getUserByLogin(login);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // insert new user
    const query = "INSERT INTO user (login, password) VALUES (?, ?)";
    const result = await this.database.execute(query, [login, password]);
    console.log(result);

    // take new user
    const userId = (result as any).insertId;
    const newUserDto: UserDtoInterface = {
      id: userId,
      login: login,
      password: password,
      created_at: new Date(),
      updated_at: new Date(),
    };
    return new User(newUserDto);
  }

  //Get user by login
  async getUserByLogin(login: string): Promise<User | null> {
    const query = "SELECT * FROM user WHERE login = ?";
    const rows = await this.database.execute(query, [login]);
    if ((rows as any).length === 0) {
      return null;
    }
    const userDto = rows[0] as UserDtoInterface;
    return new User(userDto);
  }
}
