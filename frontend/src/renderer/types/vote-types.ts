import { Poll } from './poll-types'
import { User } from './user-types'

export interface Vote {
  id: number
  poll: Poll
  voter: User
  votedFor: User
}
