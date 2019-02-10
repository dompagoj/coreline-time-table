import { action, computed, observable } from 'mobx'
import * as moment from 'moment'

import { successCode } from '../components/utils/misc'
import { CreateHourInput, HoursApi, UpdateHourInput } from '../http/HoursApi'
import { GetHoursOptions, Hour } from '../types/hours-types'

class HoursStore {
  @observable
  public hours: Hour[]

  public constructor(private api: HoursApi) {}

  public async getHours(options?: GetHoursOptions) {
    const { data } = await this.api.getHours(options)
    this.hours = data
  }

  public findHours(currDate: moment.Moment, day: number, returnIndex = false) {
    if (!this.hours) {
      return undefined
    }
    const selectedDay = moment(new Date(`${currDate.month() + 1}.${day}.${currDate.year()}`))

    return this.hours.filter(hour => {
      const date = moment(hour.date)

      return date.isSame(selectedDay)
    })
  }

  public getHour(currDate: moment.Moment, day: number, returnIndex = false) {
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
  public async createHour(input: CreateHourInput) {
    const { data, status } = await this.api.createHour(input)
    if (!successCode(status)) {
      return
    }
    this.hours.push(data)
  }

  @action.bound
  public async updateHour(input: UpdateHourInput) {
    const { data, status } = await this.api.updateHour(input)
    if (!successCode(status)) {
      return
    }
    console.log({ data })
    const hourIndex = this.hours.findIndex(hour => hour.id === data.id)
    this.hours[hourIndex] = data
  }

  // @action.bound
  // public async createHour(input: CreateHoursInput) {
  //   const { data, status } = await this.api.createHour(input)
  //   if (!successCode(status)) {
  //     return
  //   }
  //   if (data.updated) {
  //     const hourIndex = this.hours.findIndex(hour => moment(hour.date).isSame(moment(data.hour.date)))
  //     this.hours[hourIndex] = data.hour
  //   } else {
  //     this.hours.push(data)
  //   }
  // }
  @action.bound
  public async deleteHour(id) {
    const hourIndex = this.hours.findIndex(h => h.id === id)
    if (!hourIndex) {
      return
    }
    await this.api.deleteHour(id)

    this.hours.splice(hourIndex, 1)
  }

  public getMonthHours(currDate: moment.Moment) {
    return this.hours.reduce((sum, hour) => {
      const hourDate = new Date(hour.date)
      if (currDate.month() + 1 === hourDate.getMonth() + 1 && currDate.year() === hourDate.getFullYear()) {
        sum += hour.amount
      }

      return sum
    }, 0)
  }

  public async getHoursWithProjects(options?: GetHoursOptions) {
    const { data } = await this.api.getHoursWithProjects(options)
  }

  @computed
  get loading() {
    return this.hours === null || this.hours === undefined
  }
}

const hoursApi = new HoursApi()
export const hoursStore = new HoursStore(hoursApi)
