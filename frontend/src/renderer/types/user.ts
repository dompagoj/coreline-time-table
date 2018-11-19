import { UserType } from './enums'

export interface AuthUser {
  id: number
  username: string
  firstName?: string
  lastName?: string
  googleToken?: string
  email?: string
  type?: UserType
  companyId?: number
  avatar?: string
}

export interface User {
  id: number
  username: string
  email: string
  avatar?: string
}
