import * as React from 'react'
import { userStore } from '../../stores/UserStore'
import { Spinner } from '../spinner/Spinner'
import { styles } from './styles'
import { observer } from 'mobx-react'
import { Card, Avatar, Button, Icon } from 'antd'

@observer
export class Voting extends React.Component {
  public render() {
    if (userStore.loading) {
      return <Spinner />
    }
    return (
      <div>
        <div className={styles.title}>Employee of the month vote</div>
        <div className={styles.container}>
          {userStore.users.map(user => {
            return (
              <Card
                actions={[
                  <Button size="large" shape="circle-outline">
                    <Icon type="heart" theme="twoTone" twoToneColor="#ff6dbb" />
                  </Button>,
                ]}
                hoverable
                title={user.username}
                key={user.id}
              >
                <Card.Meta avatar={<Avatar src={user.avatar} />} description={`Vote for ${user.username}!`} />
              </Card>
            )
          })}
        </div>
      </div>
    )
  }
  public async componentDidMount() {
    await userStore.getUsers()
  }
}
