import {body} from 'express-validator'

export const addFileSchema = [
  body('title')
    .exists({ checkFalsy: true }).withMessage('Title is required')
    .isLength({ min: 2 }).withMessage('Title required 2 caracteres')
    .isString().withMessage('Title must be a string')
    .trim().escape(),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .trim().escape()

  file('file')
    .exists().withMessage('File is resquired')
];


