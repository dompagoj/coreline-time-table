import { stringify } from 'querystring'
import { axios } from '../../main/axios'
import { authStore } from '../stores/AuthStore'
import { GetHoursOptions } from '../types/hours-types'
import { Project } from '../types/project-types'

export class ProjectsApi {
  public async getProjects() {
    const { companyId } = authStore.user

    return axios.get(`/companies/${companyId}/projects`)
  }

  public async createProject(project: Project) {
    const { companyId } = authStore.user

    return axios.post(`/companies/${companyId}/projects`, project)
  }

  public async updateProject(id, data) {
    const { companyId } = authStore.user

    return axios.put(`/companies/${companyId}/projects/${id}`, data)
  }

  public async deleteProject(id: number) {
    const { companyId } = authStore.user

    return axios.delete(`/companies/${companyId}/projects/${id}`)
  }

  public async getProjectsWithHours(options?: GetHoursOptions) {
    const { user } = authStore
    const id = options && options.userId || authStore.user.id

    return axios.get(`/companies/${user.companyId}/projects/hours/${id}?${
      stringify(options && options.where)}
    `)
  }
}
