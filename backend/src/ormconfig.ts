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
  entities: [`${config.location}/src/data/entities/**/*${config.langExtension}`],
  migrations: [`${config.location}src/data/migrations/**/*${config.langExtension}`],
  subscribers: [`${config.location}src/data/subscribers/**/*${config.langExtension}`],
  cli: {
    entitiesDir: 'src/data/entities',
    migrationsDir: 'src/data/migrations',
    subscribersDir: 'src/data/subscribers',
  },
}
