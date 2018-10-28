import { Router } from 'express'
import { UserController } from '../controllers/UserController'

export const userRouter = Router()

UserController.registerRoutes(userRouter)
// userRouter.get('/', (req, res) => {
//   res.send('Hello world')
// })
