import { observable } from 'mobx'
import { User } from '../types/user'

class AuthStore {
  @observable
  public isLoggedIn: boolean = false

  @observable
  public user: User
}
export const authStore = new AuthStore()
