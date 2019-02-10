import { Omit } from 'antd/lib/_util/type'
import { stringify } from 'querystring'
import { axios } from '../../main/axios'
import { authStore } from '../stores/AuthStore'
import { ID } from '../types/general'
import { GetHoursOptions } from '../types/hours-types'

interface Hours {
  id: ID
  amount: number
  projectId?: number
  description?: string
}

export interface CreateHourInput {
  date: Date
  hours: Omit<Hours, 'id'>
}

export type UpdateHourInput = Hours

export class HoursApi {
  public async getHours(options?: GetHoursOptions) {
    const { user } = authStore
    const id = options && options.userId || user.id

    return axios.get(
      `/companies/${user.companyId}/users/${id}/hours?${
        stringify(options && options.where)}`
      )
  }

  public async createHour(input: CreateHourInput) {
    const { date, hours } = input
    const { user } = authStore

    return axios.post(`/companies/${user.companyId}/users/${user.id}/hours`, {
      date: date.toUTCString(),
      hours,
    })
  }

  public async updateHour(input: UpdateHourInput) {
    const { user } = authStore

    return axios.put(`/companies/${user.companyId}/users/${user.id}/hours/${input.id}`, input)
  }

  public async deleteHour(id: string | number) {
    const { user } = authStore

    return axios.delete(`companies/${user.companyId}/users/${user.id}/hours/${id}`)
  }

  public async getHoursWithProjects(options?: GetHoursOptions) {
     const { user } = authStore
     const id = options && options.userId || user.id

     return axios.get(
      `/companies/${user.companyId}/users/${id}/hours/projects?${
        stringify(options && options.where)}`
      )
  }
}
