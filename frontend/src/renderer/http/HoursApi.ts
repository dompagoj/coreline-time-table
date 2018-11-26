import { axios } from '../../main/axios'
import { authStore } from '../stores/AuthStore'
import { ID } from '../types/general'

interface GetHoursInput {
  companyId: ID
  userId: ID
}

interface ProjectHours {
  projectId: number
  hours: number
}

interface Hours {
  amount: number
  projects?: ProjectHours[] | null
}

export interface CreateHoursInput {
  date: Date
  hours: Hours
}

export class HoursApi {
  public async getHours(userId?: string) {
    const { user } = authStore
    const id = userId ? userId : user.id

    return axios.get(`/companies/${user.companyId}/users/${id}/hours`)
  }

  public async createHour(input: CreateHoursInput) {
    const { date, hours } = input
    const { user } = authStore

    return axios.put(`/companies/${user.companyId}/users/${user.id}/hours`, {
      date,
      hours,
    })
  }
  public async deleteHour(id: string | number) {
    const { user } = authStore

    return axios.delete(`companies/${user.companyId}/users/${user.id}/hours/${id}`)
  }
}
