import { Router } from 'express'
import { GenericRequest, UserRequest } from '../../data/types/express'
import { registerRoutes } from '../../utils/helper-functions'
import { UserController } from '../controllers/UserController'

export const userRouter = Router()

userRouter.use((req: GenericRequest<UserRequest>, res, next) => {
  console.log('req headers: ', req.headers)
  // @ts-ignore
  req.companyId = req.headers.companyid
  next()
})

registerRoutes(userRouter, UserController)
