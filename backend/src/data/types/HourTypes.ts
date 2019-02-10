import { Min } from 'class-validator'
import { Omit } from '../../utils/general'
import { ID } from './random'

interface Hours {
  amount: number
  projectId?: number
  description?: string
}

export interface CreateHourInput {
  hours: Hours,
  date: Date
}

export type UpdateHourInput = Hours
