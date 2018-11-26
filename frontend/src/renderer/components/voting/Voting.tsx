import { Avatar, Button, Card, Icon, Modal } from 'antd'
import { observer } from 'mobx-react'
import React from 'react'
import { eotmStore } from '../../stores/EOTMStore'
import { userStore } from '../../stores/UserStore'
import { UserType } from '../../types/enums'
import { User } from '../../types/user-types'
import { lukacErrors } from '../utils/lukac-errors'
import { Title } from '../utils/Title'
import { CountDown } from './CountDown'
import { styles } from './styles'

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

    if (!eotmStore.poll && eotmStore.startDate) {
      return <CountDown startDate={eotmStore.startDate} />
    }
    const userVote = eotmStore.getUserVote()

    return (
      <div>
        <Title text="Employee of the month vote" />
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
                style={(userVote && userVote.votedFor.id === user.id && { backgroundColor: '#cee0ff' }) || undefined}
                hoverable
                headStyle={{ fontSize: '16px', fontWeight: 'bold' }}
                title={user.username}
              >
                <Card.Meta
                  avatar={<Avatar src={user.avatar} />}
                  description={userVote ? `You voted for ${user.username}` : `Vote for ${user.username}!`}
                />
              </Card>
            )
          })}
        </div>
      </div>
    )
  }
  public vote = (user: User) => async () => {
    const { lukac } = await eotmStore.newVote(user.id)
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
    await eotmStore.getPoll()
    this.setState({
      loading: false,
    })
    if (eotmStore.startDate) {
      const interval = setInterval(() => {
        eotmStore.startDate.seconds -= 1

        const { days, hours, minutes, seconds } = eotmStore.startDate
        if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
          eotmStore.getPoll()
          clearInterval(interval)
        }
        if (eotmStore.startDate.seconds === 0) {
          eotmStore.startDate.minutes -= 1
          eotmStore.startDate.seconds = 59
        }
        if (eotmStore.startDate.minutes === 0 && hours > 0) {
          eotmStore.startDate.hours -= 1
          eotmStore.startDate.minutes = 59
        }
        if (eotmStore.startDate.hours === 0 && days > 0) {
          eotmStore.startDate.days -= 1
          eotmStore.startDate.hours = 23
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
