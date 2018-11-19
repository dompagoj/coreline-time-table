import { Router } from 'express'
import { Company } from '../../data/entities/Company'
import { User } from '../../data/entities/User'
import { UserType } from '../../data/enums/UserType'
import { registerRoutes } from '../../utils/helper-functions'
import { UserController } from '../controllers/UserController'

export const userRouter = Router({ mergeParams: true })

userRouter.use('/', async (req: any, res, next) => {
  const { companyId } = req.params
  const { companyId: reqUserCompanyId, id: reqUserId } = req.ctx.user

  if (reqUserCompanyId !== parseInt(companyId, 10)) {
    const reqUser = await User.findOne(reqUserId)
    if (reqUser.type !== UserType.ADMIN) {
      return res.status(401).end()
    }
  }

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
