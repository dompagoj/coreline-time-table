/* tslint:disable:no-console */
import * as bodyParser from 'body-parser'
import * as express from 'express'
import { createConnection } from 'typeorm'
import { config } from './config'
import { CustomNamingStragegy } from './CustomNamingStragegy'
import { mainRouter } from './routers/MainRouter'

async function bootstrap() {
  const app = express()

  app.use(bodyParser.json())

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    )
    next()
  })
  await createConnection({
    // @ts-ignore
    type: config.dbType,
    database: config.dbName,
    host: config.dbHost,
    port: config.dbPort,
    username: config.dbUsername,
    password: config.dbPassword,
    synchronize: config.dbSync,
    logging: config.dbLogging,
    namingStrategy: new CustomNamingStragegy(),
    entities: ['src/data/entities/**.ts'],
    migrations: ['src/data/migrations/**.ts'],
    subscribers: ['src/data/subscribers/**.ts'],
    cli: {
      entitiesDir: 'src/data/entities',
      migrationsDir: 'src/data/migrations',
      subscribersDir: 'src/data/subscribers',
    },
  })

  app.use('/', mainRouter)

  app.listen(8000, () => {
    console.log('server started on port 8000!')
  })
}
// tslint:disable-next-line:no-console
bootstrap().catch(console.error)
