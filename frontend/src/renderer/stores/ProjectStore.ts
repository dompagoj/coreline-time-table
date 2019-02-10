import { action, computed, observable } from 'mobx'
import { ProjectsApi } from '../http/ProjectsApi'
import { GetHoursOptions } from '../types/hours-types'
import { Project, ProjectStatus } from '../types/project-types'

class ProjectStore {
  @observable
  public projects: Project[]

  public constructor(private api: ProjectsApi) {}

  @action.bound
  public async getProjects() {
    const { data } = await this.api.getProjects()
    this.projects = data
  }

  @action.bound
  public async getProjectsWithHours(options: GetHoursOptions) {
    const { data } = await this.api.getProjectsWithHours(options)
    this.projects = data
  }

  @computed
  get loading() {
    return this.projects === undefined
  }

  @computed
  get activeProjects() {
    return this.projects.filter(p => p.status === ProjectStatus.ACTIVE)
  }

  @action.bound
  public async createProject(project: Project) {
    const { data } = await this.api.createProject(project)

    this.projects.push(data)
  }

  @action.bound
  public async deleteProject(id: number) {
    const projectIndex = this.projects.findIndex(p => p.id === id)
    await this.api.deleteProject(id)

    this.projects.splice(projectIndex, 1)
  }

  @action.bound
  public async updateProject(id: number | string, projectData: Partial<Project>) {
    const projectIndex = this.projects.findIndex(p => p.id === id)
    const { data } = await this.api.updateProject(id, projectData)

    this.projects[projectIndex] = { ...this.projects[projectIndex], ...data }
  }
}

export const projectStore = new ProjectStore(new ProjectsApi())
