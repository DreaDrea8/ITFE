import { query } from "express-validator";

export const downloadFileWithLinkSchema = [
  query('token')
    .exists({ checkFalsy: true }).withMessage('Token required')
    .isJWT().withMessage('Token JWT invalide')
]