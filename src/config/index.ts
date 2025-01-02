import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const config = {
  port: 5000,
  database_url: 'mongodb://pamoja:pamoja123@127.0.0.1:27017/match-making-backend?authSource=match-making-backend',
  // database_url: process.env.DATABASE_URL || '',
  // database_url: process.env.DATABASE_URL || '',
  // database_url: process.env.DATABASE_URL || '',
  // database_url: process.env.DATABASE_URL || '',
  bycrypt_sault_round: 12,
  env: 'development',
  emailHost: 'http://localhost:5000/',
  emailPort: 587,
  emailUser: 'rafin8990@gmail.com',
  emailPassword: 'zlrl gtaw bkwt bixy',
  emailFrom: 'rafin8990@gmail.com',
  jwt_secret: 'secret',
  jwt_expires_in: '1d',
  jwt_refresh_secret: 'very very secret',
  jwt_refresh_expires_in: '365d',
  node_email: process.env.NODE_MAILER_EMAIL,
  node_pass: process.env.NODE_MAILER_PASS,
}
export default config
