import { Card, Progress } from 'antd'
import { observer } from 'mobx-react'
import moment from 'moment'
import React from 'react'
import { eotmStore, StartDate } from '../../stores/EOTMStore'
import { Title } from '../utils/Title'
import { styles } from './styles'

interface Props {
  startDate: StartDate
}

const daysStart = moment().daysInMonth() - 3

export const CountDown = observer(props => {
  const { days, hours, minutes, seconds } = props.startDate

  return (
    <div>
      <Title text="Employee of the month vote will be live in" />
      <div style={{ padding: 20, textAlign: 'center' }}>
        <Card>
          <div className={styles.countDownContainer}>
            <Progress
              trailColor="#2b2a2a"
              strokeColor="red"
              type="circle"
              percent={100 - (days / daysStart) * 100}
              format={() => `${days} ${days === 1 ? 'Day' : 'Days'}`}
            />
            <Progress
              strokeColor="darkBlue"
              type="circle"
              percent={100 - (hours / 24) * 100}
              format={() => `${hours} ${hours === 1 ? 'Hours' : 'Hours'}`}
            />
            <Progress
              strokeColor="green"
              type="circle"
              percent={100 - (minutes / 60) * 100}
              format={() => `${minutes} ${minutes === 1 ? 'Minute' : 'Minutes'}`}
            />
            <Progress
              strokeColor="orange"
              type="circle"
              percent={100 - (seconds / 60) * 100}
              format={() => `${seconds} ${seconds === 1 ? 'Second' : 'Seconds'}`}
            />
          </div>
        </Card>
      </div>
      {eotmStore.lastWinner && (
        <Card style={{ marginTop: 25 }} title={<h3>Current winner: {eotmStore.lastWinner.username}</h3>} />
      )}
    </div>
  )
})
