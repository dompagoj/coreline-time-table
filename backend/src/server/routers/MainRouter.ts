import { Router } from 'express'
import { registerUser } from '../middlewares/auth'
import { authRouter } from './authRouter'
import { companyRouter } from './companyRouter'
import { hourRouter } from './hourRouter'
import { userRouter } from './UserRouter'

export const mainRouter = Router()

mainRouter.use('/', registerUser())

mainRouter.use('/companies', companyRouter)

mainRouter.use('/companies/:companyId/users', userRouter)

mainRouter.use('/companies/:companyId/users/:userId/hours', hourRouter)

mainRouter.use('/auth', authRouter)
