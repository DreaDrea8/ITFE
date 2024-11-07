import dotenv from 'dotenv';

dotenv.config();

export const API_PROTOCOL: string = process.env.API_PROTOCOL ?? 'https';
export const API_HOST: string = process.env.API_HOST ?? 'localhost';
export const API_PORT: number = Number(process.env.API_PORT) ?? 3000;

export const SESSION_LIFE_TIME:number = Number(process.env.SESSION_LIFE_TIME) ?? 14400 // 4h en second 
export const API_SHARE_URL_LIVE_TIME:number = Number(process.env.API_SHARE_URL_LIVE_TIME) ?? 86400000 // 24h en second 

export const HASH_SECRET: string = process.env.HASH_SECRET ?? 'ChangeMe'

export const JWT_SECRET: string = process.env.JWT_SECRET ?? 'ChangeMe'
export const JWT_EXPIRATION: number = Number(process.env.JWT_EXPIRATION) ?? 86400 // 24h en second

export const MAX_SIZE_USER: number = Number(process.env.MAX_SIZE_USER) ?? 2147483648 // 24h en second 

export const DB_HOST: string = process.env.DB_HOST ?? 'mariadb'
export const DB_PORT: number = Number(process.env.DB_PORT) ?? 3306
export const DB_USER: string = process.env.DB_USER ?? 'root'
export const DB_PASSORD: string = process.env.DB_PASSORD ?? 'password'
export const DB_DATABASE: string = process.env.DB_DATABASE ?? 'app'

