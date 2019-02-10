import { config } from './server/config'
import { CustomNamingStragegy } from './server/CustomNamingStragegy'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const connectionOptions: any = {
  type: config.dbType,
  database: config.dbName,
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUsername,
  password: config.dbPassword,
  synchronize: false,
  logging: config.dbLogging,
  namingStrategy: new CustomNamingStragegy(),
  entities: config.nodeEnv !== 'production' ? ['src/data/entities/**/*.ts'] : ['src/data/entities/**/.js'],
  migrations: config.nodeEnv !== 'production' ? ['src/data/migrations/**/*.ts'] : ['src/data/migrations/**/.js'],
  subscribers: config.nodeEnv !== 'production' ? ['src/data/subscribers/**/*.ts'] : ['src/data/subscribers/**/.js'],
  cli: {
    entitiesDir: 'src/data/entities',
    migrationsDir: 'src/data/migrations',
    subscribersDir: 'src/data/subscribers',
  },
}
