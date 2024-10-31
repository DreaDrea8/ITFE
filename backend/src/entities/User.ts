export interface UserDtoInterface {
  id: number;
  login: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export class User {
  id: number;
  login: string;
  password: string;
  created_at: Date;
  updated_at: Date;

  constructor(dto: UserDtoInterface) {
    this.id = dto.id;
    this.login = dto.login;
    this.password = dto.password;
    this.created_at = dto.created_at;
    this.updated_at = dto.updated_at;
  }
}
