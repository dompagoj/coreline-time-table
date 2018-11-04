import { computed, observable } from 'mobx'
import { User } from '../types/user'

class AuthStore {
  @observable
  public user: User

  @computed
  get isLoggedIn() {
    return this.user !== null || this.user !== undefined
  }
}
export const authStore = new AuthStore()
