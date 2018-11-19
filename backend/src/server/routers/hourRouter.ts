import { Router } from 'express'
import { User } from '../../data/entities/User'
import { UserType } from '../../data/enums/UserType'
import { registerRoutes } from '../../utils/helper-functions'
import { HourController } from '../controllers/HourController'

export const hourRouter = Router({ mergeParams: true })

hourRouter.use('/', async (req: any, res, next) => {
  const { companyId, userId: userIdParams } = req.params
  const {
    user: { id: userId },
  } = req.ctx
  const user = await User.findOne({
    where: {
      id: userId,
      companyId,
    },
  })
  if (!user) {
    return res
      .status(400)
      .json({
        error: `No user with id ${userId} under company with id ${companyId} found`,
      })
      .end()
  }
  if (user.type !== UserType.EMPLOYER) {
    if (userIdParams !== user.id) {
      return res.status(401)
    }
  }
  res.locals.user = user
  next()
})

registerRoutes(hourRouter, HourController)
