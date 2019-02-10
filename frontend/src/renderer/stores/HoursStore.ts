import { action, computed, observable } from 'mobx'
import * as moment from 'moment'

import { successCode } from '../components/utils/misc'
import { CreateHourInput, HoursApi, UpdateHourInput } from '../http/HoursApi'
import { ID } from '../types/general'
import { GetHoursOptions, Hour } from '../types/hours-types'

class HoursStore {
  @observable
  public hours: Hour[]

  public constructor(private api: HoursApi) {}

  public async getHours(options?: GetHoursOptions) {
    const { data } = await this.api.getHours(options)
    this.hours = data
  }

  public async getHoursFunctional(options?: GetHoursOptions) {
    const { data } = await this.api.getHours(options)

    return data
  }

  public findHours(currDate: moment.Moment, day: number) {
    const selectedDay = moment(new Date(`${currDate.month() + 1}.${day}.${currDate.year()}`))
    if (!this.hours) {
      return null
    }

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
    const hourIndex = this.hours.findIndex(hour => hour.id === data.id)
    this.hours[hourIndex] = data
  }

  @action.bound
  public async deleteHours(ids: ID[]) {
    await this.api.deleteHours(ids)
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

  // public async getHoursWithProjects(options?: GetHoursOptions) {
  //   const { data } = await this.api.getHoursWithProjects(options)
  // }

  @computed
  public get loading() {
    return this.hours === null || this.hours === undefined
  }
}

const hoursApi = new HoursApi()
export const hoursStore = new HoursStore(hoursApi)
