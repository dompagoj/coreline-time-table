import { action, computed, observable } from 'mobx'
import { VotingApi } from '../http/VotingApi'
import { HTTPSuccess } from '../types/HTTP_STATUS_CODES'
import { Poll } from '../types/poll-types'
import { authStore } from './AuthStore'

interface StartDate {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export class VotingStore {
  @observable
  public poll: Poll

  @observable
  public startDate: StartDate

  public constructor(private api: VotingApi) {}

  @action.bound
  public async getPoll() {
    const { data, status } = await this.api.getPoll()

    const { poll, startDate } = data

    this.startDate = startDate
    this.poll = poll
  }

  @action.bound
  public async newVote(votedFor: number) {
    const { user } = authStore
    const { data, status } = await this.api.newVote(votedFor)
    if (!HTTPSuccess(status)) {
      return { error: data.error || data }
    }
    const { newVote, lukac } = data
    if (lukac) {
      return { lukac }
    }

    const voteIndex = this.poll.votes.findIndex(vote => vote.voter.id === user.id)
    if (voteIndex === -1) {
      this.poll.votes.push(newVote)
    }
    this.poll.votes[voteIndex] = newVote

    return { newVote }
  }
}
const votingApiInstance = new VotingApi()
export const votingStore = new VotingStore(votingApiInstance)
