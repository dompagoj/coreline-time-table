import { Router } from 'express'
import { get } from 'https'
import { scheduleJob } from 'node-schedule'

import { Poll } from '../../data/entities/Poll'
import { PollType } from '../../data/enums/PollType'
import { registerRoutes } from '../../utils/helper-functions'
import { verifyCompany } from '../middlewares/auth'

export const votingRouter = Router({ mergeParams: true })

votingRouter.use('/', verifyCompany)
