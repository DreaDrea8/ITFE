export interface FileDtoInterface {
  id: number
  title: string
  description: string 
  userId: string
  reference: string
  signature: string
  size: string
  createAt: Date
  updateAt: Date
}

export class File {
  id: number
  title: string
  description: string 
  userId: string
  reference: string
  signature: string
  size: string
  createAt: Date
  updateAt: Date

  constructor(dto:FileDtoInterface){
    this.id = dto.id
    this.title = dto.title
    this.description = dto.description 
    this.userId = dto.userId
    this.reference = dto.reference
    this.signature = dto.signature
    this.size = dto.size
    this.createAt = dto.createAt
    this.updateAt = dto.updateAt
  }
}