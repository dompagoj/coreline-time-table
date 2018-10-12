import * as moment from 'moment'

export function getDays(): number {
  return moment().daysInMonth()
}
export function weekDays() {
  return moment.weekdays()
}
