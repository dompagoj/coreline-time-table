import Axios from 'axios'
import { UserType } from '../types/enums'
import { ID } from '../types/general'

export interface GetUsersInput {
  companyId: ID
}
export interface GetUserInput extends GetUsersInput {
  userId: ID
}

export interface CreateUserInput {
  username: string
  type: UserType
  googleToken?: string | null
  firstName: string
  lastName: string
  companyId: ID
}

export class UsersApi {
  public async getUsers({ companyId }: GetUsersInput) {
    return Axios.get(`http://localhost:8000/companies/${companyId}/users`)
  }

  public async getUser({ userId, companyId }: GetUserInput) {
    return Axios.get(`http://localhost:8000/companies/${companyId}/users/${userId}`)
  }
  public createUser({ companyId, ...data }: CreateUserInput) {
    return Axios.post(`http://localhost:8000/companies/${companyId}/users`, data)
  }
}
