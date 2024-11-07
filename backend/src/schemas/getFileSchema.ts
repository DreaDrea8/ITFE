import { param } from "express-validator";

export const getFileSchema = [
  param('file_id')
    .exists({ checkFalsy: true }).withMessage('File_id is required')
    .isInt().withMessage('File_id must be an integer')
]