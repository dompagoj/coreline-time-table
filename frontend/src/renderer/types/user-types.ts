import { UserType } from './enums'

export interface User {
  id: number
  username: string
  firstName?: string
  lastName?: string
  email: string
  type: UserType
  companyId: number
  avatar?: string
}

export interface UserFilters {
  type?: UserType
}
