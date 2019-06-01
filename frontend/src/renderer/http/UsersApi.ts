import { stringify } from 'querystring'
import { axios } from '../../main/axios'
import { authStore } from '../stores/AuthStore'
import { UserType } from '../types/enums'

export interface UpdateUserInput {
  username: string
  type: UserType
  authKey: string
}

export class UsersApi {
  public async getUsers(filters) {
    const { user } = authStore

    return axios.get(`companies/${user.companyId}/users?${stringify(filters)}`)
  }

  public async updateUser(input: UpdateUserInput) {
    const { companyId, id } = authStore.user

    return axios.put(`companies/${companyId}/users/${id}`, { ...input })
  }

  public async updateAvatar(formData: FormData) {
    const { companyId, id } = authStore.user

    return axios.post(`companies/${companyId}/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
  }
}
