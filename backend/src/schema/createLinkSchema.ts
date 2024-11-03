import { body } from "express-validator";

export const createLinkSchema = [
  body('file_id')
    .exists({ checkFalsy: true }).withMessage('file_id is required')
    .isInt().withMessage('File_id must be an integer'),
  
  body('expiration_date')
    .optional()
    .isISO8601().withMessage('expiration_date must be a valid date (YYYY-MM-DDTHH:mm:ss±hh:mm)')
    .isAfter(new Date().toISOString()).withMessage('expiration_date must be in the future')
  
]