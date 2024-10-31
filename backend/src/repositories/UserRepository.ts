import { Connection } from "mysql2"

import { User, UserDtoInterface } from "@src/entities/User"
import loggerService from "@src/services/logger/LoggerService";

export class UserRepository {
  database: Connection;

  constructor(database: Connection) {
    this.database = database;
  }

  async addUser(dto: addUserDtoInterface): Promise<User | Error> {
    try {
      loggerService.success('Début d\'insertion de l\'utilisateur');
      
      // Insère un nouvel utilisateur et récupère l'ID
      const insertQuery = "INSERT INTO user (login, password) VALUES (?, ?)";
      const result: any = this.database.query(insertQuery, [dto.login, dto.password]);

      loggerService.obj(result)

      // Crée un nouvel utilisateur avec les informations récupérées
      const userRow = result[0];
      const newUserDto: UserDtoInterface = {
        id: userRow.id,
        login: userRow.login,
        password: userRow.password,
        createdAt: userRow.created_at,
        updatedAt: userRow.updated_at,
      };

      loggerService.success('Utilisateur inséré avec succès');
      return new User(newUserDto);
    } catch (error) {
      loggerService.error(`Erreur lors de l'insertion de l'utilisateur`);
      throw error;
    }
  }
}


  //Get user by login
  // async getUserByLogin(login: string): Promise<User | null> {
  //   const query = "SELECT * FROM user WHERE login = ?";
  //   const rows = await this.database.execute(query, [login]);
  //   if ((rows as any).length === 0) {
  //     return null;
  //   }
  //   const userDto = rows[0] as UserDtoInterface;
  //   return new User(userDto);
  // }



export interface addUserDtoInterface {
  login: string
  password: string 
}