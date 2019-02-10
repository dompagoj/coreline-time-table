import { Hour } from './hours-types'

export interface Project {
  id: string | number
  name: string
  avatar?: string
  status: ProjectStatus
  hours: Hour[]
  creatorId: number
}

export enum ProjectStatus {
  ACTIVE = 'active',
  DONE = 'done',
}
