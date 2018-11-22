import { Router } from 'express'
import { registerRoutes } from '../../utils/helper-functions'
import { UserController } from '../controllers/UserController'
import { verifyCompany } from '../middlewares/auth'

export const userRouter = Router({ mergeParams: true })

userRouter.use('/', verifyCompany)

registerRoutes(userRouter, UserController)
