import { action, computed, observable } from 'mobx'
import { GetUsersInput, UsersApi } from '../http/UsersApi'

class UserStore {
  @observable
  public users: any

  constructor(public usersApi: UsersApi) {}

  @computed
  public get loading() {
    return this.users === undefined || this.users === null
  }
  @action
  public async getUsers(input: GetUsersInput) {
    const { data, status } = await this.usersApi.getUsers(input)
    this.users = data
  }
  public getUser(id: number) {
    return this.users.find(user => user.id === id)
  }
}

const usersApiInstance = new UsersApi()
export const userStore = new UserStore(usersApiInstance)
