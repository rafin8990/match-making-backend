import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bycrypt_sault_round: process.env.BCRYPT_SAULT_ROUND,
  env: process.env.NODE_ENV,
  emailHost: process.env.EMAIL_HOST || 'http://localhost:5000/',
  emailPort: process.env.EMAIL_PORT || 587,
  emailUser: process.env.EMAIL_USER ,
  emailPassword: process.env.EMAIL_PASSWORD,
  emailFrom: process.env.EMAIL_FROM ,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
};
