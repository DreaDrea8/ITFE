import { Request } from 'express'

import { User } from '@src/entities/User'

declare module 'express-serve-static-core' {
  interface Request {
    user?: User; 
  }
}