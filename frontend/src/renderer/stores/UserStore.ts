import { action, computed, observable } from 'mobx'
import { UpdateUserInput, UsersApi } from '../http/UsersApi'
import { HTTPStatusCodes } from '../types/HTTP_STATUS_CODES'
import { User } from '../types/user'

class UserStore {
  @observable
  public users: User[]

  constructor(public usersApi: UsersApi) {}

  @computed
  get loading() {
    return this.users === null || this.users === undefined
  }

  @action.bound
  public async getUsers() {
    const { data, status } = await this.usersApi.getUsers()
    this.users = data
  }

  public getUser(id: number) {
    return this.users.find(user => user.id === id)
  }

  public async updateUser(input: UpdateUserInput) {
    const { data, status } = await this.usersApi.updateUser(input)
    if (status === HTTPStatusCodes.OK) {
      return { data, error: '' }
    }
    return { data, error: data.error }
  }
}

const usersApiInstance = new UsersApi()
export const userStore = new UserStore(usersApiInstance)