export interface ReferenceDtoInterface {
  id: number
  signature: string
  usage: number | null
  createdAt: Date
  updatedAt: Date
  revokedAt: Date | null
}

export class Reference {
  id: number
  signature: string
  usage: number | null
  createdAt: Date
  updatedAt: Date
  revokedAt: Date | null

  constructor(dto:ReferenceDtoInterface){
    this.id = dto.id
    this.signature = dto.signature
    this.usage = dto.usage
    this.createdAt = dto.createdAt
    this.updatedAt = dto.updatedAt
    this.revokedAt = dto.revokedAt
  }
}