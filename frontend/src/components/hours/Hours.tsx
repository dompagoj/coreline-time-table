import { Button, message, Popconfirm } from 'antd'
import { css, cx } from 'emotion'
import * as moment from 'moment'
import * as React from 'react'

import { inRange } from '../utils/misc'
import { styles } from './styles'

interface IState {
  currDate: moment.Moment
}

export class Hours extends React.Component<any, IState> {
  public state: IState = {
    currDate: moment(),
  }

  public render() {
    const { currDate } = this.state

    const endOfPreviousMonth = moment(currDate)
      .add(-1, 'months')
      .endOf('month')

    const daysBefore: number[] = inRange(
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

    const daysAfter: number[] =
      currDate.endOf('month').isoWeekday() > 0
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
    const days = inRange(currDate.daysInMonth())

    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={this.goToPrevMonth}>&lt;</Button>
          <div>{this.state.currDate.format('MMM, YYYY')}</div>
          <Button onClick={this.goToNextMonth}>&gt;</Button>
        </div>
        <div className={styles.header}>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
        <div className={styles.rowContainer}>
          {daysBefore.map(day => (
            <div
              onClick={this.goToPrevMonth}
              key={day}
              className={styles.disabledDayContainer}
            >
              <div className={styles.dayContent}>{day + 1}</div>
            </div>
          ))}
          {days.map(day => (
            <Popconfirm
              title="Title"
              placement="right"
              onConfirm={this.onConfirm}
              onCancel={this.onCancel}
            >
              <div
                onClick={this.handleDateSelect(day + 1)}
                key={day}
                className={styles.dayContainer}
              >
                <div className={styles.dayContent}>
                  <div className={styles.day}>{day + 1}</div>
                  <div className={styles.content}> 8 hours </div>
                </div>
              </div>
            </Popconfirm>
          ))}
          {daysAfter.map(day => (
            <div
              onClick={this.goToNextMonth}
              key={day}
              className={styles.disabledDayContainer}
            >
              <div className={styles.dayContent}>{day + 1}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  public handleDateSelect = day => () => {
    const { currDate } = this.state
    const selectedDay = moment(
      new Date(`${currDate.month() + 1}.${day}.${currDate.year()}`),
    )
  }
  public onConfirm = () => {
    message.success('Confirmed')
  }
  public onCancel = () => {
    message.warning('Canceled')
  }
  public goToPrevMonth = () => {
    this.setState({
      currDate: moment(this.state.currDate).add(-1, 'months'),
    })
  }
  public goToNextMonth = () => {
    this.setState({
      currDate: moment(this.state.currDate).add(1, 'months'),
    })
  }
}
