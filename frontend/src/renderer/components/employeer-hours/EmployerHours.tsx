import { AutoComplete, Avatar, Calendar, Card, Input } from 'antd'
import { observer } from 'mobx-react'
import moment from 'moment'
import React from 'react'

import { generalStateStore } from '../../stores/GeneralState'
import { hoursStore } from '../../stores/HoursStore'
import { projectStore } from '../../stores/ProjectStore'
import { userStore } from '../../stores/UserStore'
import { User } from '../../types/user-types'
import { getHoursTableDataSource, getProjectsTotalHours, sum } from '../utils/misc'
import { Title } from '../utils/Title'
import { HoursTable } from './HoursTable'
import { styles } from './styles'

const Option = AutoComplete.Option

interface State {
  filteredUsers: User[]
  selectedUser?: User
  calendarMode: 'year' | 'month'
  currDate: moment.Moment
}

@observer
export class EmployerHours extends React.Component<any, State> {
  public state: State = {
    filteredUsers: [],
    selectedUser: undefined,
    calendarMode: 'year',
    currDate: moment().subtract(1, 'month'),
  }
  public render() {
    if (userStore.loading) {
      return null
    }
    const { filteredUsers, selectedUser, currDate, calendarMode } = this.state
    const { userSearchInput } = generalStateStore

    return (
      <div>
        <Title text="Employer dashboard" />
        <div className={styles.searchContainer}>
          <div className={styles.searchStyle}>
            <AutoComplete
              value={userSearchInput}
              autoFocus
              onSearch={this.handleSearch}
              style={{ width: '100%' }}
              dataSource={filteredUsers.map(renderOption)}
              optionLabelProp="text"
              onSelect={this.onSelect}>
              <Input size="large" placeholder="Employee email or username" style={{ height: '50px' }} />
            </AutoComplete>
          </div>
        </div>
        {selectedUser && !projectStore.loading && (
          <div style={{ padding: '10px 20px' }}>
            <Card
              headStyle={{ textAlign: 'center' }}
              title={
                <h2 style={{ margin: 0, padding: '0' }}>
                  {selectedUser.firstName} {selectedUser.lastName}
                </h2>}
            >
              <div className={styles.container}>
                <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
                  <Calendar
                    onPanelChange={this.onCalendarModeChange}
                    onSelect={this.onDateSelect}
                    value={currDate}
                    fullscreen={false}
                    mode={calendarMode}
                  />
                </div>
                <div>
                  <h2 className={styles.hoursTitle}>{`Hours in ${currDate.format('MMMM')} (${currDate.format(
                    'YYYY',
                  )})`}</h2>
                  <HoursTable
                    totalHours={getProjectsTotalHours(projectStore.projects)}
                    dataSource={getHoursTableDataSource(projectStore.projects, currDate.month() + 1)}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    )
  }
  public async componentDidMount() {
    await userStore.getUsers()
    const selectedUser = userStore.users.find(user => user.username === generalStateStore.userSearchInput)

    if (selectedUser) {
      this.setState({ selectedUser })
    }
  }
  public onSelect = async username => {
    const selectedUser = userStore.users.find(user => user.username === username)
    generalStateStore.userSearchInput = username

    this.setState({
      selectedUser,
    })
    await projectStore.getProjectsWithHours({
      userId: selectedUser && selectedUser.id || undefined,
      where: { month: this.state.currDate.month() + 1 }
    })

  }

  public handleSearch = value => {
    generalStateStore.userSearchInput = value
    this.setState({
      filteredUsers: !value
        ? []
        : userStore.users.filter(user => user.username.startsWith(value) || user.email.startsWith(value)),
    })
  }
  public onDateSelect = async (date: moment.Moment) => {
    if (date.month() !== this.state.currDate.month()) {
      const { selectedUser } = this.state
      await projectStore.getProjectsWithHours({
         userId: selectedUser && selectedUser.id || undefined,
         where: { month: date.month() + 1 }
      })
    }
    this.setState({
      currDate: date,
    })
  }
  public onCalendarModeChange = (date: moment.Moment, mode: 'year' | 'month') => {
    this.setState({
      calendarMode: mode,
      currDate: date,
    })
  }
}

function renderOption(user: User) {
  return (
    <Option key={user.id.toString()} value={user.username} style={{ borderBottom: '1px solid lightGray' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '15% auto', gridGap: '5px' }}>
        {user.avatar ? (
          <Avatar src={user.avatar} className={styles.avatar} />
        ) : (
          <Avatar className={styles.avatar} icon="user" />
        )}
        <div>
          <div>{user.username}</div>
          <div>{user.email}</div>
        </div>
      </div>
    </Option>
  )
}
