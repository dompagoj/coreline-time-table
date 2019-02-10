import { ID } from './general'
import { Project } from './project-types'

export interface Hour {
  id: ID
  amount: number
  description: string
  date: string
  projectId?: number
  project?: Project,
  userId: number
  user?: number
}

export interface GetHoursOptions {
  userId?: string | number
  include?: string[]
  where?: {
    month: string | number
    projectNull?: boolean
  }
}
