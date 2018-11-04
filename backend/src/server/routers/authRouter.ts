import { Router } from 'express'
import { registerRoutes } from '../../utils/helper-functions'
import { AuthController } from '../controllers/AuthController'

export const authRouter = Router()

registerRoutes(authRouter, AuthController)
