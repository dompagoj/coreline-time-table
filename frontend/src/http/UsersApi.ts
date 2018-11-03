import Axios from 'axios'
import { ID } from '../types/general'

export interface GetUsersInput {
  companyId: ID
}
export interface GetUserInput extends GetUsersInput {
  userId: ID
}

export class UsersApi {
  public async getUsers({ companyId }: GetUsersInput) {
    return Axios.get(`http://localhost:8000/companies/${companyId}/users`)
  }

  public async getUser({ userId, companyId }: GetUserInput) {
    return Axios.get(`http://localhost:8000/companies/${companyId}/users/${userId}`)
  }
}
