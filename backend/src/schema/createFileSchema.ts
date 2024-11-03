import {body} from 'express-validator'

export const createFileSchema = [
  body('libelle')
    .exists({ checkFalsy: true }).withMessage('Libellé is required')
    .isLength({ min: 2 }).withMessage('Libellé required 2 caracteres')
    .isString().withMessage('Libellé must be a string')
    .trim().escape(),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .trim().escape()
];


