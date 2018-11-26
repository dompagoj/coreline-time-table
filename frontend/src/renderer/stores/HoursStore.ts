import { action, computed, observable } from 'mobx'
import * as moment from 'moment'

import { successCode } from '../components/utils/misc'
import { CreateHoursInput, HoursApi } from '../http/HoursApi'

class HoursStore {
  @observable
  public hours: any[]

  public constructor(private api: HoursApi) {}

  @action.bound
  public async getHours(userId?: string) {
    const { data } = await this.api.getHours(userId)
    this.hours = data
  }

  public getHour(currDate, day, returnIndex = false) {
    if (!this.hours) {
      return undefined
    }
    const selectedDay = moment(new Date(`${currDate.month() + 1}.${day}.${currDate.year()}`))

    const foundHourIndex = this.hours.findIndex(hour => {
      const date = moment(hour.date)

      return date.isSame(selectedDay)
    })

    return returnIndex ? foundHourIndex : this.hours[foundHourIndex]
  }

  @action.bound
  public async createHour(input: CreateHoursInput) {
    const { data, status } = await this.api.createHour(input)
    if (!successCode(status)) {
      return
    }
    if (data.updated) {
      const hourIndex = this.hours.findIndex(hour => hour.date === data.hour.date)
      this.hours[hourIndex] = data.hour
    } else {
      this.hours.push(data)
    }
  }
  @action.bound
  public async deleteHour(currDate, day) {
    const hourIndex = this.getHour(currDate, day, true)
    await this.api.deleteHour(this.hours[hourIndex].id)

    this.hours.splice(hourIndex, 1)
  }

  @computed
  get loading() {
    return this.hours === null || this.hours === undefined
  }
}

const hoursApi = new HoursApi()
export const hoursStore = new HoursStore(hoursApi)
