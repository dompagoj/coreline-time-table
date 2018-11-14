import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth'
import { authRouter } from './authRouter'
import { companyRouter } from './companyRouter'
import { hourRouter } from './hourRouter'
import { userRouter } from './userRouter'

export const mainRouter = Router()

mainRouter.use('/auth', authRouter)

mainRouter.use('/', verifyJWT())

mainRouter.use('/companies', companyRouter)

mainRouter.use('/companies/:companyId/users', userRouter)

mainRouter.use('/companies/:companyId/users/:userId/hours', hourRouter)
