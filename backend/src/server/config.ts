import { strToBool } from '../utils/helper-functions'

export const config = {
  dbType: process.env.DB_TYPE,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: parseInt(process.env.DB_PORT, 10),
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbSync: strToBool(process.env.DB_SYNC),
  dbLogging: strToBool(process.env.DB_LOGGING),
  jwtSecret: process.env.JWT_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
}
