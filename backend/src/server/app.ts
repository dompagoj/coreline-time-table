import * as bodyParser from 'body-parser'
import * as express from 'express'
import { ConnectionOptions, createConnection } from 'typeorm'
import { mainRouter } from './router/MainRouter'

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

  await createConnection()

  app.use('/', mainRouter)

  app.listen(8000, () => {
    // tslint:disable-next-line:no-console
    console.log('server started on port 8000!')
  })
}
// tslint:disable-next-line:no-console
bootstrap().catch(console.error)
