import { Min } from 'class-validator'
import { ID } from './random'

interface Hours {
  id: string | number
  amount: number
  projectId?: number
  description?: string
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
