/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { strToBool } from '../utils/helper-functions'

export const config = {
  dbType: process.env.DB_TYPE!,
  dbHost: process.env.DB_HOST!,
  dbName: process.env.DB_NAME!,
  dbPort: parseInt(process.env.DB_PORT!, 10),
  dbUsername: process.env.DB_USERNAME!,
  dbPassword: process.env.DB_PASSWORD!,
  dbLogging: strToBool(process.env.DB_LOGGING!),
  nodeEnv: process.env.NODE_ENV!,
  jwtSecret: process.env.JWT_SECRET!,
  port: parseInt(process.env.PORT!, 10),
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  bucketUrl: process.env.BUCKET_URL!,
}
