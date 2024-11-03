export interface ReferenceDtoInterface {
  id: number
  signature: string
  usage: number
  createdAt: Date
  updatedAt: Date
}

export class Reference {
  id: number
  signature: string
  usage: number
  createdAt: Date
  updatedAt: Date

  constructor(dto:ReferenceDtoInterface){
    this.id = dto.id
    this.signature = dto.signature
    this.usage = dto.usage
    this.createdAt = dto.createdAt
    this.updatedAt = dto.updatedAt
  }
}

