import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('Falta definir DATABASE_URL en las variables de entorno');
}

export const sql = neon(process.env.DATABASE_URL);