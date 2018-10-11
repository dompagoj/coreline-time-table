import * as moment from 'moment'

export function getDays(): number {
  return moment().daysInMonth()
}
