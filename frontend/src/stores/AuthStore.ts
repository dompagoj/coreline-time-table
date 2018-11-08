import Axios from 'axios'
import { decode } from 'jsonwebtoken'
import { action, computed, observable } from 'mobx'
import { User } from '../types/user'

class AuthStore {
  @observable
  public user: User

  @observable
  public token: string

  @computed
  get isLoggedIn() {
    return this.token !== null && this.token !== undefined
  }
  @computed get loading() {
    return this.user === null || this.user === undefined
  }

  @action
  public async getUser() {
    const { id }: any = decode(this.token)
    const { data } = await Axios.get(`http://localhost:8000/companies/1/users/${id}`)
    this.user = data
  }
}
export const authStore = new AuthStore()