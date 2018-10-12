import { css } from 'emotion'
import * as moment from 'moment'
import * as React from 'react'

import { inRange } from '../utils/misc'

const container = css`
  min-width: 400px;
`

const dayContainer = css`
  padding: 10px;
  border: 1px solid black;
  margin: -1px -1px 0 0;
  &:hover {
    background-color: lightgray;
  }
`
const dayContent = css`
  padding: 0 5px 0 0;
  text-align: end;
`
const header = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  justify-items: center;
`

interface IState {
  month: moment.Moment
}

export class Hours extends React.Component<any, IState> {
  public state: IState = {
    month: moment().month(10),
  }

  public render() {
    const endOfPreviousMonth = moment(this.state.month)
      .add(-1, 'months')
      .endOf('month')

    const daysBefore: number[] = inRange(
      Math.max(
        0,
        moment(this.state.month)
          .startOf('month')
          .isoWeekday() - 1,
      ),
    )
      .map(i => {
        return endOfPreviousMonth.date() - i - 1
      })
      .reverse()

    // -1
    const daysAfter: number[] =
      this.state.month.endOf('month').isoWeekday() > 0
        ? inRange(
            Math.max(
              0,
              7 -
                moment(this.state.month)
                  .endOf('month')
                  .isoWeekday(),
            ),
          )
        : []
    const days = inRange(this.state.month.daysInMonth())

    return (
      <div className={container}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={() =>
              this.setState({
                month: moment(this.state.month).add(-1, 'months'),
              })
            }
          >
            &lt;
          </button>
          <div>{this.state.month.format('MMM, YYYY')}</div>
          <button
            onClick={() =>
              this.setState({
                month: moment(this.state.month).add(1, 'months'),
              })
            }
          >
            &gt;
          </button>
        </div>
        <div className={header}>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
        <div className={rowContainer}>
          {daysBefore.map(day => (
            <div key={day} className={dayContainer}>
              <div className={dayContent}>{day + 1}</div>
            </div>
          ))}
          {days.map(day => (
            <div key={day} className={dayContainer}>
              <div className={dayContent}>{day + 1}</div>
            </div>
          ))}
          {daysAfter.map(day => (
            <div key={day} className={dayContainer}>
              <div className={dayContent}>{day + 1}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
const rowContainer = css`
  display: grid;
  grid: auto-flow 100px / repeat(7, 1fr);
`
