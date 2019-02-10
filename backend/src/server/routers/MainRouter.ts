import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth'
import { authRouter } from './authRouter'
import { companyRouter } from './companyRouter'
import { hourRouter } from './hourRouter'
import { projectsRouter } from './projectsRouter'
import { userRouter } from './userRouter'
// import { votingRouter } from './votingRouter'

export const mainRouter = Router()

mainRouter.use('/auth', authRouter)

mainRouter.use('/', verifyJWT)

mainRouter.use('/companies', companyRouter)

mainRouter.use('/companies/:companyId/users', userRouter)

// mainRouter.use('/companies/:companyId/voting', votingRouter)

mainRouter.use('/companies/:companyId/projects', projectsRouter)

mainRouter.use('/companies/:companyId/users/:userId/hours', hourRouter)

mainRouter.use('*', (req, res) => {
  res.status(400).json({ error: 'Non existing route' })
})
