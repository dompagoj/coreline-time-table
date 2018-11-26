import * as moment from 'moment'
import { getRepository } from 'typeorm'

import { Company } from '../../data/entities/Company'
import { Poll } from '../../data/entities/Poll'
import { User } from '../../data/entities/User'
import { Vote } from '../../data/entities/Vote'
import { PollType } from '../../data/enums/PollType'
import { Context } from '../../data/types/Context'
import { getPollWinner } from '../../utils/general'
import { GET, POST } from '../controller-decorators'
import { BaseController } from './BaseController'

export class VotingControllerEOTM extends BaseController<
  Context,
  { companyId: string; pollId: string },
  { company: Company }
> {
  constructor(req, res, next) {
    super(req, res, next)
  }

  @GET('/oftm')
  public async getActivePollEOFMAndLastWinner() {
    const { companyId } = this.routeData
    const currDate = moment()

    const startDate = moment()
      .endOf('month')
      .subtract(3, 'days')
      .subtract(12, 'hours')

    const lastPoll = await getRepository(Poll)
      .createQueryBuilder('poll')
      .leftJoinAndSelect('poll.votes', 'vote')
      .leftJoinAndSelect('vote.votedFor', 'user')
      .where('EXTRACT(month from poll.start_date) = :lastMonth', { lastMonth: moment().month() })
      .getOne()

    const lastWinner = getPollWinner(lastPoll)

    if (currDate.isBefore(startDate)) {
      const diff = startDate.diff(currDate, 'hours', true)
      const days = Math.floor(diff / 24)
      const hours = Math.floor(diff - days * 24)
      const minutes = Math.floor(((diff - days * 24) % 1) * 60)
      const seconds = Math.floor(((((diff - days * 24) % 1) * 60) % 1) * 60)

      return this.accepted({ startDate: { days, hours, minutes, seconds }, poll: undefined, lastWinner })
    }

    const poll = await Poll.findOne({
      where: {
        companyId,
        active: true,
        type: PollType.EMPLOYEE_OF_THE_MONTH,
      },
      relations: ['votes', 'votes.votedFor', 'votes.voter'],
    })

    if (!poll) {
      const newPoll = await Poll.create({
        endDate: moment()
          .endOf('month')
          .add(1, 'hour'),
        type: PollType.EMPLOYEE_OF_THE_MONTH,
        companyId: parseInt(companyId, 10),
      }).save()

      return this.accepted({ poll: newPoll, startDate: undefined, lastWinner })
    }

    return this.accepted({ poll, startDate: undefined, lastWinner })
  }

  @POST('/oftm/:pollId')
  public async voteEOFM({ votedForId }) {
    if (!votedForId) {
      return this.badRequest()
    }
    const { id } = this.ctx.user
    const { pollId } = this.routeData
    const user = await User.findOneOrFail(id)
    const votedFor = await User.findOne(votedForId)

    if (!votedFor) {
      return this.badRequest()
    }
    if (votedFor.email === 'mislav.lukac@coreline.agency') {
      return this.accepted({ lukac: 'Lukac voting... :D' })
    }

    await Vote.delete({
      voter: user,
    })

    const newVote = await Vote.create({
      poll: {
        id: parseInt(pollId, 10),
      },
      voter: user,
      votedFor,
    }).save()

    return this.accepted({ newVote })
  }
}
