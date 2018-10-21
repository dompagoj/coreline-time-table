import * as express from 'express'
import { User } from '../../entities/User'

export const mainRouter = express.Router()

mainRouter.post('create-user', async (req, res) => {
  // TODO
})
mainRouter.get('', async (req, res) => {
  const users = await User.find()
  res.json({
    users,
  })
})
