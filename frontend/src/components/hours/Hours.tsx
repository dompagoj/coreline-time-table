import { Button, message, Popconfirm } from 'antd'
import { observer } from 'mobx-react'
import * as moment from 'moment'
import * as React from 'react'

import { userStore } from '../../stores/UserStore'
import { inRange } from '../utils/misc'
import { styles } from './styles'

interface IState {
  currDate: moment.Moment
}

@observer
export class Hours extends React.Component<any, IState> {
  public state: IState = {
    currDate: moment(),
  }
  public render() {
    if (userStore.loading) {
      return <div>Loading...</div>
    }
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
          <div style={{}}>
            <span style={{ marginRight: '5px', fontWeight: 'bold', fontSize: '20px' }}>
              {this.state.currDate.format('MMMM')}
            </span>
            <span>{this.state.currDate.format('YYYY')}</span>
          </div>
          <div>
            <Button onClick={this.goToPrevMonth}>&lt;</Button>
            <Button onClick={this.goToToday}>Today</Button>
            <Button onClick={this.goToNextMonth}>&gt;</Button>
          </div>
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
            <div onClick={this.goToPrevMonth} key={`${day}-before`} className={styles.disabledDayContainer}>
              <div className={styles.dayContent}>
                <div className={styles.day}>{day + 1}</div>
              </div>
            </div>
          ))}
          {days.map(day => (
            <Popconfirm
              key={`${day}-current`}
              title="Title"
              placement="right"
              onConfirm={this.onConfirm}
              onCancel={this.onCancel}
            >
              <div onClick={this.handleDateSelect(day + 1)} className={styles.dayContainer}>
                <div className={styles.dayContent}>
                  <div className={this.isToday(day + 1) ? styles.today : styles.day}>{day + 1}</div>
                  <div className={styles.content}> 8 hours </div>
                </div>
              </div>
            </Popconfirm>
          ))}
          {daysAfter.map(day => (
            <div onClick={this.goToNextMonth} key={`${day}-after`} className={styles.disabledDayContainer}>
              <div className={styles.dayContent}>
                <div className={styles.day}>{day + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  public componentWillMount() {
    userStore.getUsers({ companyId: 1 })
  }

  public isToday = day => {
    if (this.state.currDate.month() !== moment().month()) {
      return false
    }

    return moment().date() === day
  }
  public handleDateSelect = day => () => {
    const { currDate } = this.state
    const selectedDay = moment(new Date(`${currDate.month() + 1}.${day}.${currDate.year()}`))
  }
  public onConfirm = () => {
    message.success('Confirmed')
  }
  public onCancel = () => {
    message.warning('Canceled')
  }
  public goToToday = () => {
    this.setState({
      currDate: moment(),
    })
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
