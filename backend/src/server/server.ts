import * as bodyParser from 'body-parser'
import * as express from 'express'

const app = express()

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>')
})

app.listen(3000, () => {
  // tslint:disable-next-line:no-console
  console.log('server started on port 3000!')
})
