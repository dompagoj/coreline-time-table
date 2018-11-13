import * as moment from 'moment'
import { inRange } from './misc'

export function getDays(): number {
  return moment().daysInMonth()
}
export function weekDays() {
  return moment.weekdays()
}

export function getDaysBefore(currDate: moment.Moment) {
  const endOfPreviousMonth = moment(currDate)
    .add(-1, 'months')
    .endOf('month')

  return inRange(
    Math.max(
      0,
      moment(currDate)
        .startOf('month')
        .isoWeekday() - 1,
    ),
  )
    .map(i => {
      return endOfPreviousMonth.date() - i + 1
    })
    .reverse()
}

export function getDaysAfter(currDate: moment.Moment) {
  return currDate.endOf('month').isoWeekday() > 0
    ? inRange(
        Math.max(
          0,
          7 -
            moment(currDate)
              .endOf('month')
              .isoWeekday(),
        ),
      )
    : []
}
