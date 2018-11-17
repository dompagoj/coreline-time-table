import Axios from 'axios'
import { UserType } from '../types/enums'
import { ID } from '../types/general'
import { axios } from './axios'

export interface GetUsersInput {
  companyId: ID
}
export interface GetUserInput extends GetUsersInput {
  userId: ID
}

export interface UpdateUserInput {
  companyId: ID
  username: string
  type: UserType
  authKey: string
}

export class UsersApi {
  public async getUsers({ companyId }: GetUsersInput) {
    return axios.get(`companies/${companyId}/users`)
  }

  public async getUser({ userId, companyId }: GetUserInput) {
    return axios.get(`companies/${companyId}/users/${userId}`)
  }

  public async updateUser(input: UpdateUserInput) {
    const { companyId, ...data } = input

    return axios.put(`companies/${input.companyId}/users`, { ...data })
  }
}
