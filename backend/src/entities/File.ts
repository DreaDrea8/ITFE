export interface FileDtoInterface {
  id: number
  libelle: string
  description: string | null
  fileName: string | null
  originalFileName: string
  mimetype: string
  userId: number
  referenceId: number
  size: number
  createdAt: Date
  updatedAt: Date
  revokedAt: Date | null

}

export class File {
  id: number
  libelle: string
  description: string | null
  fileName: string | null
  originalFileName: string
  mimetype: string
  userId: number
  referenceId: number
  size: number
  createdAt: Date
  updatedAt: Date
  revokedAt: Date | null

  constructor(dto: FileDtoInterface) {
    this.id = dto.id
    this.libelle = dto.libelle
    this.description = dto.description
    this.fileName = dto.fileName
    this.originalFileName = dto.originalFileName
    this.mimetype = dto.mimetype
    this.userId = dto.userId
    this.referenceId = dto.referenceId
    this.size = dto.size
    this.createdAt = dto.createdAt
    this.updatedAt = dto.updatedAt
    this.revokedAt = dto.revokedAt
  }
}


