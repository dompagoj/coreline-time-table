// tslint:disable-next-line:no-var-requires
require('dotenv').config()
/* tslint:disable:no-console */
import 'reflect-metadata'

import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { createConnection } from 'typeorm'

import { connectionOptions } from '../ormconfig'
import { config } from './config'
import { mainRouter } from './routers/MainRouter'

async function bootstrap() {
  const app = express()

  app.use(cors())
  app.use(bodyParser.json())

  await createConnection(connectionOptions)

  morgan.token('operation', (req) => {
    return req.body.operationName
  })
  morgan.token('params', (req) => {
    return JSON.stringify(req.params)
  })

  app.use(morgan(':date[clf] :method :url :status :params :operation'))

  app.use('', mainRouter)

  app.listen(config.port, () => {
    console.log(`Server started on port: ${config.port}`)
  })
}

bootstrap().catch(console.error)
