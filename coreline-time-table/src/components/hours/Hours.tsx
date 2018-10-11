import { Col, Row } from 'antd'
import { css } from 'emotion'
import * as React from 'react'

import { getDays } from '../utils/hours'
import { inRange } from '../utils/misc'

const container = css`
  min-width: 400px;
`

const dayContainer = css`
  padding: 10px;
  border: 1px solid black;
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

export class Hours extends React.Component {
  public render() {
    const days = getDays()
    return (
      <div className={container}>
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
          {inRange(days).map(day => (
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
