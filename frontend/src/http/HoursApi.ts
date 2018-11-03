import Axios from 'axios'
import { ID } from '../types/general'
interface GetHoursInput {
  companyId: ID
  userId: ID
}

export class HoursApi {
  public async getHours({ userId, companyId }: GetHoursInput) {
    return Axios.get('http://localhost:8000/')
  }
}
