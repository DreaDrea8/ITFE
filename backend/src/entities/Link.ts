export interface LinkDtoInterface {
  id: number;
  userId: number;
  fileId: number;
  createdAt: Date;
  updatedAt: Date;
  expiredAt: Date;
}

export class Link {
  id: number;
  userId: number;
  fileId: number;
  createdAt: Date;
  updatedAt: Date;
  expiredAt: Date;

  constructor(dto: LinkDtoInterface) {
    this.id = dto.id;
    this.userId = dto.userId;
    this.fileId = dto.fileId;
    this.createdAt = dto.createdAt;
    this.updatedAt = dto.updatedAt;
    this.expiredAt = dto.expiredAt;
  }
}