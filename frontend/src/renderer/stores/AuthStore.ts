import { ipcRenderer } from 'electron'
import { decode } from 'jsonwebtoken'
import { action, computed, observable } from 'mobx'
import { axios } from '../../main/axios'
import { User } from '../types/user-types'
import { routerStore } from './router/router-store'

class AuthStore {
  @observable
  public user: User

  @observable
  public companyAuthKey: string

  @observable
  public token?: string

  @computed
  public get isLoggedIn() {
    return this.token !== null && this.token !== undefined
  }
  @computed
  public get loading() {
    return this.user === null || this.user === undefined
  }

  @action
  public async getUser() {
    if (!this.token) {
      return routerStore.gotoLogin()
    }
    const { id, companyId }: any = decode(this.token)
    const { data, status } = await axios.get(`companies/${companyId}/users/${id}`)
    if (status >= 400 && status < 500) {
      ipcRenderer.send('logout')

      return routerStore.gotoLogin()
    }
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

