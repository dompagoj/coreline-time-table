import { AxiosResponse } from 'axios'
import { UserType } from './enums'

export interface LoginResponse extends AxiosResponse {
  data: {
    error?: string
    token: string
    user: {
      id: number
      username: string
      firstName: string
      lastName: string
      email: string
      type: UserType
      companyId: number,
    },
  }
}
