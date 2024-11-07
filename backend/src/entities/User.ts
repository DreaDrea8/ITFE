export enum userRoleEnum {
  USER = "USER",
  ADMINISTRATOR = "ADMINISTRATOR"
}

export interface UserDtoInterface {
  id: number
  login: string
  password: string
  role: userRoleEnum, 
  createdAt: Date
  updatedAt: Date
  revokedAt: Date | null
}

export class User {
  id: number
  login: string
  password: string
  role: userRoleEnum
  createdAt: Date
  updatedAt: Date
  revokedAt: Date | null

  constructor(dto: UserDtoInterface) {
    this.id = dto.id
    this.login = dto.login
    this.password = dto.password
    this.role = dto.role
    this.createdAt = dto.createdAt
    this.updatedAt = dto.updatedAt
    this.revokedAt = dto.revokedAt
  }
}
