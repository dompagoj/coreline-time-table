import { ProjectStatus } from '../enums/ProjectStatus'

export interface CreateProjectInput {
  name: string
  avatar: string
  status: ProjectStatus
}

export interface UpdateProjectInput  extends CreateProjectInput {
  id: string
}
