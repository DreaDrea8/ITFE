export interface UserDtoInterface {
  id: number;
  login: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  id: number;
  login: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(dto: UserDtoInterface) {
    this.id = dto.id;
    this.login = dto.login;
    this.password = dto.password;
    this.createdAt = dto.createdAt;
    this.updatedAt = dto.updatedAt;
  }
}
