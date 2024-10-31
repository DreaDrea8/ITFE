import { User } from "@src/entities/User";
import { Repository } from "@src/repositories/Repository";
import { jsonContent } from "@src/types/jsonContent";
import { Request, Response } from "express";
import { UserRepository } from "@src/repositories/UserRepository";

export class AddUser {
  repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  async execute(req: Request, res: Response) {
    try {
      const { login, password } = req.body;
      const newUser = await this.repository.userRepository.createUser(
        login,
        password
      );
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
  }
}
