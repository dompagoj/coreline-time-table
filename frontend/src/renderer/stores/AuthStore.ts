import { decode } from 'jsonwebtoken'
import { action, computed, observable } from 'mobx'
import { axios } from '../../main/axios'
import { AuthUser } from '../types/user'

class AuthStore {
  @observable
  public user: AuthUser

  @observable
  public companyAuthKey: string

  @observable
  public token: string

  @computed
  get isLoggedIn() {
    return this.token !== null && this.token !== undefined
  }
  @computed
  get loading() {
    return this.user === null || this.user === undefined
  }

  @action
  public async getUser() {
    const { id, companyId }: any = decode(this.token)
    const { data } = await axios.get(`companies/${companyId}/users/${id}`)
    this.user = data.user
    this.companyAuthKey = data.authKey
  }

  public async verifyCompanyKey(authKey: string) {
    const { companyId } = this.user
    const { data } = await axios.post(`companies/${companyId}/verify-key`, { authKey })

    return data
  }
}
export const authStore = new AuthStore()
