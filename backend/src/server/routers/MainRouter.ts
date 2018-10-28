import { Router } from 'express'
import { userRouter } from './UserRouter'

export const mainRouter = Router()

mainRouter.use('/users', userRouter)
