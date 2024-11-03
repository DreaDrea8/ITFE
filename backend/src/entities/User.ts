export enum userRoleEnum {
  USER = "USER",
  ADMNINISTRATOR = "ADMNINISTRATOR"
}

export interface UserDtoInterface {
  id: number;
  login: string;
  password: string;
  role: userRoleEnum, 
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  id: number;
  login: string;
  password: string;
  role: userRoleEnum;
  createdAt: Date;
  updatedAt: Date;

  constructor(dto: UserDtoInterface) {
    this.id = dto.id;
    this.login = dto.login;
    this.password = dto.password;
    this.role = dto.role;
    this.createdAt = dto.createdAt;
    this.updatedAt = dto.updatedAt;
  }
}

const dtoUser: UserDtoInterface = {
	id: 1,
	login: "user",
	password: "123",
  role: userRoleEnum.USER, 
	createdAt: new Date,
	updatedAt: new Date
}
export const userExemple: User = new User(dtoUser)

const dtoAdmin: UserDtoInterface = {
	id: 1,
	login: "user",
	password: "123",
  role: userRoleEnum.ADMNINISTRATOR, 
	createdAt: new Date,
	updatedAt: new Date
}
export const adminExemple: User = new User(dtoAdmin)