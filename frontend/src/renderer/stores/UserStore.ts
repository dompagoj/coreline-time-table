import { action, computed, observable } from 'mobx'
import { UpdateUserInput, UsersApi } from '../http/UsersApi'
import { HTTPStatusCodes } from '../types/HTTP_STATUS_CODES'
import { User, UserFilters } from '../types/user-types'

class UserStore {
  @observable
  public users: User[] = []

  public constructor(public usersApi: UsersApi) {}

  @computed
  public get loading() {
    return this.users === null || this.users === undefined
  }

  @action.bound
  public async getUsers(filters: UserFilters = {}) {
    const { data, status } = await this.usersApi.getUsers(filters)
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
