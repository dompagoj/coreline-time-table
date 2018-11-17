import { UserType } from './enums'

export interface User {
  id: number
  username: string
  firstName?: string
  lastName?: string
  googleToken?: string
  email?: string
  type?: UserType
  companyId?: number
}
