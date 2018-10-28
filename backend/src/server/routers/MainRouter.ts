import { Router } from 'express'
import { companyRouter } from './companyRouter'
import { hourRouter } from './hourRouter'
import { userRouter } from './UserRouter'

export const mainRouter = Router()

mainRouter.use('/companies', companyRouter)

mainRouter.use('/users', userRouter)

mainRouter.use('/companies/:companyId/users/:userId/hours', hourRouter)
