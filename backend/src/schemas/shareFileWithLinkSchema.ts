import { query } from "express-validator";

export const shareFileWithLinkSchema = [
  query('token')
    .exists({ checkFalsy: true }).withMessage('Token required')
    .isJWT().withMessage('Token JWT invalide')
]