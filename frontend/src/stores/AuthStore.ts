import { observable } from 'mobx'

class AuthStore {
  @observable
  public isLoggedIn: boolean = false
}

export const authStore = new AuthStore()
