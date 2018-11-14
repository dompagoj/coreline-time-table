import { action, computed, observable } from 'mobx'
import { GetUsersInput, UpdateUserInput, UsersApi } from '../http/UsersApi'

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
  public async updateUser(input: UpdateUserInput) {
    const { data, status } = await this.usersApi.updateUser(input)

    return data
  }
}

const usersApiInstance = new UsersApi()
export const userStore = new UserStore(usersApiInstance)
