import { Avatar, Button, Card, Icon, Modal, Progress } from 'antd'
import { observer } from 'mobx-react'
import * as moment from 'moment'
import React from 'react'
import { userStore } from '../../stores/UserStore'
import { votingStore } from '../../stores/VotingStore'
import { UserType } from '../../types/enums'
import { lukacErrors } from '../utils/lukac-errors'
import { styles } from './styles'

const daysStart = moment().daysInMonth() - 3

interface State {
  interval: any
  loading: boolean
  lukacErrorCount: number
}

@observer
export class Voting extends React.Component<any, State> {
  public state: State = {
    interval: null,
    loading: true,
    lukacErrorCount: 0,
  }

  public render() {
    if (this.state.loading) {
      return null
    }

    if (!votingStore.poll && votingStore.startDate) {
      const { days, minutes, hours, seconds } = votingStore.startDate

      return (
        <div style={{ padding: 20, textAlign: 'center' }}>
          <Card title={<h2>Employee of the month vote will be live in</h2>}>
            <div className={styles.countDownContainer}>
              <Progress
                trailColor="#2b2a2a"
                strokeColor="red"
                type="circle"
                percent={100 - (days / daysStart) * 100}
                format={() => `${days} Days`}
              />
              <Progress
                strokeColor="darkBlue"
                type="circle"
                percent={100 - (hours / 24) * 100}
                format={() => `${hours} Hours`}
              />
              <Progress
                strokeColor="green"
                type="circle"
                percent={100 - (minutes / 60) * 100}
                format={() => `${minutes} Minutes`}
              />
              <Progress
                strokeColor="orange"
                type="circle"
                percent={100 - (seconds / 60) * 100}
                format={() => `${seconds} Seconds`}
              />
            </div>
          </Card>
          {/* <Card style={{ marginTop: 25 }} title={<h3>Current winner</h3>} /> */}
        </div>
      )
    }

    return (
      <div>
        <div className={styles.title}>Employee of the month vote</div>
        <div className={styles.container}>
          {userStore.users.map(user => {
            return (
              <Card
                key={user.id}
                actions={[
                  <Button onClick={this.vote(user)} key={`${user.id}-button`} size="large" shape="circle-outline">
                    <Icon type="heart" theme="twoTone" twoToneColor="#ff6dbb" />
                  </Button>,
                ]}
                hoverable
                headStyle={{ fontSize: '16px', fontWeight: 'bold' }}
                title={user.username}
              >
                <Card.Meta avatar={<Avatar src={user.avatar} />} description={`Vote for ${user.username}!`} />
              </Card>
            )
          })}
        </div>
      </div>
    )
  }
  public vote = user => async () => {
    const { lukac } = await votingStore.newVote(user.id)
    if (lukac) {
      const { lukacErrorCount } = this.state
      const errorsLength = lukacErrors.length

      Modal.error({
        title: 'Oops',
        content: lukacErrors[lukacErrorCount % errorsLength],
      })
      this.setState({
        lukacErrorCount: lukacErrorCount + 1,
      })
    }
  }

  public async componentDidMount() {
    await userStore.getUsers({
      type: UserType.EMPLOYEE,
    })
    await votingStore.getPoll()
    this.setState({
      loading: false,
    })

    if (votingStore.startDate) {
      const interval = setInterval(() => {
        votingStore.startDate.seconds -= 1

        const { days, hours, minutes, seconds } = votingStore.startDate
        if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
          votingStore.getPoll()
          clearInterval(interval)
        }
        if (votingStore.startDate.seconds === 0) {
          votingStore.startDate.minutes -= 1
          votingStore.startDate.seconds = 59
        }
        if (votingStore.startDate.minutes === 0 && hours > 0) {
          votingStore.startDate.hours -= 1
          votingStore.startDate.minutes = 59
        }
        if (votingStore.startDate.hours === 0 && days > 0) {
          votingStore.startDate.days -= 1
          votingStore.startDate.hours = 23
        }
      }, 1000)
      this.setState({
        interval,
      })
    }
  }
  public async componentWillUnmount() {
    clearInterval(this.state.interval)
  }
}
