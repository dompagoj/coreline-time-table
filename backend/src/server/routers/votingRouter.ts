import * as express from 'express'
import { get } from 'https'
import { scheduleJob } from 'node-schedule'

import { Poll } from '../../data/entities/Poll'
import { PollType } from '../../data/enums/PollType'
import { registerRoutes } from '../../utils/helper-functions'
import { VotingControllerEOTM } from '../controllers/VotingController'
import { verifyCompany } from '../middlewares/auth'

export const votingRouter = express.Router({ mergeParams: true })

votingRouter.use('/', verifyCompany)

registerRoutes(votingRouter, VotingControllerEOTM)

scheduleJob('0 0 1 * *', async () => {
  get('https://cronitor.link/A6oGQV/run')

  const polls = await Poll.find({
    where: {
      active: true,
      type: PollType.EMPLOYEE_OF_THE_MONTH,
    },
  })
  if (polls.length === 0) {
    get('https://cronitor.link/A6oGQV/complete')
    // tslint:disable-next-line
    console.warn('No active EOTM poll!!')

    return
  }
  if (polls.length > 1) {
    // send me email?
    // tslint:disable-next-line
    console.error('More then one EOTM poll active!!')
  }
  const promises = polls.map(async poll => {
    poll.active = false

    return poll.save()
  })
  await Promise.all(promises)

  get('https://cronitor.link/A6oGQV/complete')
})
