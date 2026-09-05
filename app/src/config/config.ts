import dotenv from 'dotenv';

dotenv.config();

const pgUrl = process.env.DATABASE_URL || '';

const username = process.env.DEFAULT_USER_NAME || 'UserName';
const email = process.env.DEFAULT_USER_EMAIL || 'user@example.com';
const password = process.env.DEFAULT_USER_PASSWORD || 'user_password';

export const postgres = {
  pgUrl,
};

export const defaultUser = {
  username,
  email,
  password
}