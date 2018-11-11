import { Router } from 'express'
import { registerRoutes } from '../../utils/helper-functions'
import { UserController } from '../controllers/UserController'

export const userRouter = Router({ mergeParams: true })

registerRoutes(userRouter, UserController)
