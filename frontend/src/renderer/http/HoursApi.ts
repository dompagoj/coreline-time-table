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
  public async getHours() {
    const { user } = authStore

    return axios.get(`/companies/${user.companyId}/users/${user.id}/hours`)
  }

  public async createHour(input: CreateHoursInput) {
    const { date, hours } = input
    const { user } = authStore

    return axios.put(`/companies/${user.companyId}/users/${user.id}/hours`, {
      date,
      hours,
    })
  }
}
