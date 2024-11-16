import { query } from "express-validator";

export const readFileWithLinkSchema = [
  query('token')
    .exists({ checkFalsy: true }).withMessage('Token required')
    .isJWT().withMessage('Token JWT invalide')
]