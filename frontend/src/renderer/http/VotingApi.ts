import { axios } from '../../main/axios'
import { authStore } from '../stores/AuthStore'
import { votingStore } from '../stores/VotingStore'

export class VotingApi {
  public async getPoll() {
    const { user } = authStore

    return axios.get(`/companies/${user.companyId}/voting/oftm`)
  }
  public async newVote(votedForId: number) {
    const { user } = authStore
    const { poll } = votingStore

    return axios.post(`companies/${user.companyId}/voting/oftm/${poll.id}`, {
      votedForId,
    })
  }
}
