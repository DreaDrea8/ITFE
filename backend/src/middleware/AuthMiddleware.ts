import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

import ERRORS from '@src/commons/Error'
import { User } from '@src/entities/User'
import { Service } from '@src/services/service'
import { JWT_SECRET } from '@src/commons/config'
import { jsonContent } from '@src/types/jsonContent'
import { Repository } from '@src/repositories/Repository'
import { decode } from 'punycode'


export const authMiddleware = (repository: Repository, service: Service) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader) {
        const result: jsonContent = {
          message: 'Invalid request',
          data: null,
          error: ERRORS.AUTH_MIDDLEWARE_FAIL
        }
        res.status(400).json(result)
        return
      }

      const token = authHeader.split(' ')[1]
      if (!token) {
        const result: jsonContent = {
          message: 'Invalid request',
          data: null,
          error: ERRORS.AUTH_MIDDLEWARE_FAIL
        }
        res.status(400).json(result)
        return
      }

      let decoded: any 
      try {
        decoded = jwt.verify(token, JWT_SECRET)
      } catch (error) {
        const result: jsonContent = {
          message: 'Access denied',
          data: null,
          error: service.formatError(error, ERRORS.AUTH_MIDDLEWARE_FAIL)
        }
        res.status(403).json(result)
        return
      }

      const user: User | null = await repository.userRepository.selectUserById({id : decoded.userId})
      if (!user) {
        throw new Error(ERRORS.USER_NOT_FOUND)
      }

      req.user = user 
      next()

    } catch (error) {
      service.loggerService.error(ERRORS.AUTH_MIDDLEWARE_FAIL)
      const result: jsonContent = {
        message: 'General server error',
        data: null,
        error: service.formatError(error, ERRORS.AUTH_MIDDLEWARE_FAIL)
      }
      res.status(500).json(result)
      return
    }
  }
}