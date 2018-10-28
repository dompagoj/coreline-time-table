import { Company } from '../entities/Company'
import { UserType } from '../enums/UserType'

export interface UserCreateInput {
  username: string
  googleToken?: string | null
  type: UserType
  company: Company
}
