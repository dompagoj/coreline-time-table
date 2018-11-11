import { ID } from '../types/general'
import { axios } from './axios'

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
    return axios.get('/companies/1/users/60/hours')
  }

  public async createHour(input: CreateHoursInput) {
    const { date, hours } = input

    return axios.post('/companies/1/users/60/hours', {
      date,
      hours,
    })
  }
}
