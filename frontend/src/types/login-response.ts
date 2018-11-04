import { UserType } from './enums'

export interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    firstName: string
    lastName: string
    email: string
    type: UserType
    companyId: number,
  }
}
