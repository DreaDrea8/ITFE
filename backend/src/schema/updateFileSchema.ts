import {body} from 'express-validator'
import { param } from "express-validator";

export const updateFileSchema = [
  param('file_id')
  .exists({ checkFalsy: true }).withMessage('File_id is required')
  .isInt().withMessage('File_id must be an integer'),

  body('libelle')
    .optional()
    .isString().withMessage('Libellé must be a string')
    .isLength({ min: 2 }).withMessage('Libellé required 2 caracteres')
    .trim().escape(),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .trim().escape(),

  body('fileName')
    .optional()
    .isString().withMessage('FileName must be a string')
    .trim().escape()
];



