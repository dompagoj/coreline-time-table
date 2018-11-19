import Axios from 'axios'
import { axios } from '../../main/axios'
import { UserType } from '../types/enums'
import { ID } from '../types/general'
import { authStore } from '../stores/AuthStore'

export interface UpdateUserInput {
  username: string
  type: UserType
  authKey: string
}

export class UsersApi {
  public async getUsers() {
    const { user } = authStore
    return axios.get(`companies/${user.companyId}/users`)
  }

  public async updateUser(input: UpdateUserInput) {
    const { companyId, id } = authStore.user

    return axios.put(`companies/${companyId}/users/${id}`, { ...input })
  }
}
