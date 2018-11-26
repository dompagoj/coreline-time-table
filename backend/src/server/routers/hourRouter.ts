import { Router } from 'express'
import { User } from '../../data/entities/User'
import { UserType } from '../../data/enums/UserType'
import { registerRoutes } from '../../utils/helper-functions'
import { HourController } from '../controllers/HourController'

export const hourRouter = Router({ mergeParams: true })

hourRouter.use('/', async (req: any, res, next) => {
  const { companyId, userId: userIdParams } = req.params
  const { id: userId } = req.ctx.user

  if (userIdParams && parseInt(userIdParams, 10) !== userId) {
    const reqUser = await User.findOneOrFail(userId)
    if (reqUser.type !== UserType.EMPLOYER) {
      return res.status(401).end()
    }
  }

  const user = await User.findOne({
    where: {
      id: userIdParams,
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
  res.locals.user = user
  next()
})

registerRoutes(hourRouter, HourController)
