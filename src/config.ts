import * as dotenv from 'dotenv';

dotenv.config();

export const HTTP_PORT = process.env.HTTP_PORT || 3000;
export const DATABASE_NAME = process.env.DATABASE_NAME || 'example_db';
export const DATABASE_USER = process.env.DATABASE_USER || '';
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
export const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
export const DATABASE_PORT =
  parseInt(process.env.DATABASE_PORT as string) || 5432;
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const TOKEN_EXP = process.env.TOKEN_EXP || '24h';
