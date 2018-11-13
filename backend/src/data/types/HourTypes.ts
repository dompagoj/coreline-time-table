import { Min } from 'class-validator'
import { ID } from './random'

interface ProjectHours {
  projectId: number
  hours: number
}

interface Hours {
  amount: number
  projects?: ProjectHours[] | null
}

export class HourInput {
  @Min(0)
  public id: ID

  public hours: Hours

  public date: Date

  public constructor({ id, hours, date }: HourInput) {
    this.id = id
    this.hours = hours
    this.date = date
  }
}
