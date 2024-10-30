export interface UserDtoInterface {
  id: number
  email: string
  lastname: string 
  firstname: string
  password: string
  createAt: Date
  updateAt: Date
}

export class User {
  id: number
  email: string
  lastname: string 
  firstname: string
  password: string
  createAt: Date
  updateAt: Date

  constructor(dto:UserDtoInterface){
    this.id = dto.id
    this.email = dto.email
    this.lastname = dto.lastname
    this.firstname = dto.firstname
    this.password = dto.password
    this.createAt = dto.createAt
    this.updateAt = dto.updateAt
  }
}