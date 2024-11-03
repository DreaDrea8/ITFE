import { param, query } from "express-validator";

export const downloadWithLinkSchema = [
  query('token')
  .exists({ checkFalsy: true }).withMessage('Token required')
  .isJWT().withMessage('Token JWT invalide'),
]