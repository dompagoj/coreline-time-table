import { Router } from 'express'
import { User } from '../../data/entities/User'
import { registerRoutes } from '../../utils/helper-functions'
import { HourController } from '../controllers/HourController'

export const hourRouter = Router({ mergeParams: true })

hourRouter.use('/', async (req, res, next) => {
  const { userId, companyId } = req.params
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
  res.locals.user = user
  next()
})

registerRoutes(hourRouter, HourController)
