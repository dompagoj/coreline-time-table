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
      return endOfPreviousMonth.date() - i - 1
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

export const today = moment()

export function checkIfOutOfBounds(top, windowHeight, MODAL_HEIGHT) {
  const condition = (top + MODAL_HEIGHT) - windowHeight
  if (condition > 0)  {
    return condition
  }

  return 0
}
export function  checkifOutOfBoundsX(x, width, modalXOffset, windowHeight, MODAL_WIDTH) {
  console.log('X INSIDE FUN', x)
  const condition =  windowHeight - (x + width + modalXOffset + MODAL_WIDTH)
  console.log('CONDITION: ', condition)
  if (condition < 0) {
    return condition + width + MODAL_WIDTH
   }

  return 0
}
