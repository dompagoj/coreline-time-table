import { Router } from 'express'
import { Company } from '../../data/entities/Company'
import { registerRoutes } from '../../utils/helper-functions'
import { UserController } from '../controllers/UserController'

export const userRouter = Router({ mergeParams: true })

userRouter.use('/', async (req, res, next) => {
  const { companyId } = req.params
  const company = await Company.findOne(companyId)
  if (!company) {
    return res
      .json({ error: 'Invalid company id' })
      .status(400)
      .end()
  }
  res.locals.company = company
  next()
})

registerRoutes(userRouter, UserController)
