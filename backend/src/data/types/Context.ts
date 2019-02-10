import { UserType } from '../enums/UserType'
import { EntityID } from './random'

export interface Context {
  user: {
    id: EntityID
    email: string
    type: UserType
  };
}
