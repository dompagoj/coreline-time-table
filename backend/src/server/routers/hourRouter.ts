import { Router } from 'express'
import { registerRoutes } from '../../utils/helper-functions'
import { HourController } from '../controllers/HourController'
import { verifyUser } from '../middlewares/auth'

export const hourRouter = Router({ mergeParams: true })

hourRouter.use('/', verifyUser)

registerRoutes(hourRouter, HourController)
