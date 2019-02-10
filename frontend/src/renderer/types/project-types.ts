import { Hour } from './hours-types'

export interface Project {
  id: string | number
  name: string
  avatar: string | undefined
  status: ProjectStatus
  hours: Hour[]
}

export enum ProjectStatus {
  ACTIVE = 'active',
  DONE = 'done',
}
