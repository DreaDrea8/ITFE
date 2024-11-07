export interface LinkDtoInterface {
  id: number
  userId: number | null
  fileId: number
  createdAt: Date
  updatedAt: Date
  revokedAt: Date
}

export class Link {
  id: number
  userId: number | null
  fileId: number
  createdAt: Date
  updatedAt: Date
  revokedAt: Date

  constructor(dto: LinkDtoInterface) {
    this.id = dto.id
    this.userId = dto.userId
    this.fileId = dto.fileId
    this.createdAt = dto.createdAt
    this.updatedAt = dto.updatedAt
    this.revokedAt = dto.revokedAt
  }
}