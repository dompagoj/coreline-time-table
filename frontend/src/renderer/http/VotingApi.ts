import { axios } from '../../main/axios'
import { authStore } from '../stores/AuthStore'
import { eotmStore } from '../stores/EOTMStore'

export class VotingApi {
  public async getEOTMPoll() {
    const { user } = authStore

    return axios.get(`/companies/${user.companyId}/voting/oftm`)
  }
  public async newVote(votedForId: number) {
    const { user } = authStore
    const { poll } = eotmStore

    return axios.post(`companies/${user.companyId}/voting/oftm/${poll.id}`, {
      votedForId,
    })
  }
}
