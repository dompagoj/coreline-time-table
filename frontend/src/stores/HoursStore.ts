import { action, computed, observable } from 'mobx'
import * as moment from 'moment'

import { CreateHoursInput, HoursApi } from '../http/HoursApi'

class HoursStore {
  @observable
  public hours: any[]

  public constructor(private api: HoursApi) {}

  @action.bound
  public async getHours() {
    const { data } = await this.api.getHours()
    this.hours = data
  }

  public getHour(currDate, day) {
    const selectedDay = moment(new Date(`${currDate.month() + 1}.${day}.${currDate.year()}`))

    const foundHour = this.hours.find(hour => {
      const date = moment(hour.date)

      return date.isSame(selectedDay)
    })

    return foundHour
  }

  @action.bound
  public async createHour(input: CreateHoursInput) {
    const { data } = await this.api.createHour(input)
    this.hours.push(data)
  }
  @computed
  get loading() {
    return this.hours === null || this.hours === undefined
  }
}

const hoursApi = new HoursApi()
export const hoursStore = new HoursStore(hoursApi)
