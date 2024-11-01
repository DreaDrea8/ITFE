import { Request, Response } from "express";
import multer from "multer";
import ERRORS from "@src/commons/Error";
import { jsonContent } from "@src/types/jsonContent";
import { Repository } from "@src/repositories/Repository";
import loggerService from "@src/services/logger/LoggerService";
import { validationResult } from "express-validator";


const upload = multer({ dest: "tmp/" });

export class AddFile {
  repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  // Assurez-vous que multer est utilisé ici
  execute = async (req: Request, res: Response) => {
    try {
      const valid = validationResult(req);

      if (!valid.isEmpty()) {
        const result: jsonContent = {
          message: 'Internal Server Error',
          data: null,
          error: valid
        };
        res.status(500).json(result);
      }

      
      const title = req.body.title;
      const description = req.body.description;
      const file = req.file;

    

      const fileRepositoryResult = true;
      const result: jsonContent = {
        message: 'Infos retrieved successfully',
        data: fileRepositoryResult,
        error: null
      };
      res.status(200).json(result);
    } catch (error: any) {
      loggerService.error(ERRORS.ADD_FILE_CONTROLLER_FAIL);
      const result: jsonContent = {
        message: 'Internal Server Error',
        data: null,
        error: error.message
      };
      res.status(500).json(result);
    }
  };
}

export default upload;
