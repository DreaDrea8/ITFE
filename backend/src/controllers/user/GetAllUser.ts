import { User } from "@src/entities/User"
import { Repository } from "@src/repositories/Repository"
import { jsonContent } from "@src/types/jsonContent"
import { Request, Response } from "express"

export class GetAllUser {
  repository: Repository

  constructor(repository: Repository) {
    this.repository = repository
  }

  async execute (req: Request, res: Response ){
    try {
      const users = await this.repository.userRepository.getAll()
      const result:jsonContent = {
        message: 'Infos retrieved successfully',
        data: users, 
        error: null
      }
      res.status(200).json(result);        
    } catch (error: any) {
      const result: jsonContent = {
        message: 'Internal Server Error',
        data: null, 
        error: error.message
      }
      res.status(500).json(result);
    }
  }
}


