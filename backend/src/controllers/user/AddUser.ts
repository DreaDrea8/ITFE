import { User } from "@src/entities/User";
import { Repository } from "@src/repositories/Repository";
import { jsonContent } from "@src/types/jsonContent";
import { Request, Response } from "express";
import loggerService from "@src/services/logger/LoggerService";
import { addUserDtoInterface } from "@src/repositories/UserRepository";
import bcrypt from "bcrypt";

export class AddUser {
  repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  execute = async (req: Request, res: Response) => {
    try {
      const { login, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const dto: addUserDtoInterface = {
        login: login,
        password: hashedPassword,
      };
      const newUser = await this.repository.userRepository.addUser(dto);
      const result: jsonContent = {
        message: "Infos retrieved successfully",
        data: newUser,
        error: null,
      };
      res.status(200).json(result);
    } catch (error: any) {
      const result: jsonContent = {
        message: "Internal Server Error",
        data: null,
        error: error.message,
      };
      res.status(500).json(result);
    }
  };
}
