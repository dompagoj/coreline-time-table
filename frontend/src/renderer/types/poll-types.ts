import { Vote } from './vote-types'

enum PollType {
  EMPLOYEE_OF_THE_MONTH = 'employee_of_the_month',
}

export interface Poll {
  id: number
  companyId: number
  type: PollType
  startDate: Date
  endDate: Date
  active: boolean
  votes: Vote[]
}
