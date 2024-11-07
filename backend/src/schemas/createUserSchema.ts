import { body } from "express-validator";

export const createUserSchema = [
  body('login')
    .exists({ checkFalsy: true }).withMessage('Login is required')
    .isLength({ min: 3 }).withMessage('Login required 3 caracteres')
    .isString().withMessage('Login must be a string')
    .trim().escape(),

  body('password')
    .exists({ checkFalsy: true }).withMessage('Password is required')
    .isLength({ min: 3 }).withMessage('Password required 3 caracteres')
    .isString().withMessage('Password must be a string')
    .trim().escape()
]