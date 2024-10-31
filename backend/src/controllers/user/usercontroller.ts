// userController.ts
import { UserRepository } from "@src/repositories/UserRepository";
import { Request, Response } from "express";

export class UserController {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async register(req: Request, res: Response) {
    const { login, password } = req.body;

    try {
      const newUser = await this.userRepository.createUser(login, password);
      return res.status(201).json({
        message: "User created successfully",
        data: newUser,
        error: null,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
        data: null,
        error: error.message,
      });
    }
  }
}
