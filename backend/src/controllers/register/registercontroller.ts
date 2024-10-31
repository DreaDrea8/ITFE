import { Request, Response } from "express";
import { Repository } from "../../repositories/Repository";

export class RegisterController {
  repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  async register(req: Request, res: Response): Promise<Response> {
    const { login, password } = req.body;

    // Validation des données d'entrée
    if (!login || !password) {
      return res.status(400).json({
        message: "Login and password are required",
        data: null,
        error: "VALIDATION_ERROR",
      });
    }

    try {
      // Appel au dépôt pour créer un utilisateur
      const user = await this.repository.userRepository.createUser(
        login,
        password
      );

      // Réponse en cas de succès
      return res.status(201).json({
        message: "User registered successfully",
        data: user,
        error: null,
      });
    } catch (error: any) {
      // Réponse en cas d'erreur serveur
      return res.status(500).json({
        message: "Error registering user",
        data: null,
        error: error.message,
      });
    }
  }
}
