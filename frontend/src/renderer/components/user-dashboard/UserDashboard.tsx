import { Calendar, Card } from 'antd'
import { observer } from 'mobx-react'
import moment from 'moment'
import React from 'react'
import { authStore } from '../../stores/AuthStore'
import { hoursStore } from '../../stores/HoursStore'
import { projectStore } from '../../stores/ProjectStore'
import { userStore } from '../../stores/UserStore'
import { HoursTable } from '../employeer-hours/HoursTable'
import { getHoursTableDataSource, getProjectsTotalHours, groupNoProjectHours } from '../utils/misc'
import styles from './styles'
import { Title } from '../utils/Title'
import { Hour } from '../../types/hours-types'


interface State {
  calendarMode: 'year' | 'month'
  currDate: moment.Moment
  loading: boolean
  noProjectHours?: any
}

@observer
export class UserDashboard extends React.Component<any, State> {
  public state: State = {
    calendarMode: 'year',
    loading: true,
    currDate: moment().subtract(1, 'month'),
  }
  public render() {
    const { currDate, calendarMode, loading } = this.state

    if (loading) {
      return null
    }

    return (
      <div>
        <Title text="User dashboard" />
        <div style={{ padding: '10px 20px' }}>
          <Card
            headStyle={{ textAlign: 'center' }}
            title={
              <h2 style={{ margin: 0, padding: '0' }}>
                Your hours
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
                  noProjectHours={this.state.noProjectHours}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }
  public async componentDidMount() {
    this.fetchHours()
  }

  public onDateSelect = async (date: moment.Moment) => {
    if (date.month() !== this.state.currDate.month()) {
      await this.fetchHours(date)
    }
    this.setState({
      currDate: date,
    })
  }

  public fetchHours = async (date?: moment.Moment) => {
    const month = date ? date.month() + 1 : this.state.currDate.month() + 1
    const { user } = authStore

    const [_, noProjectHours] = await Promise.all([
      projectStore.getProjectsWithHours({
        userId: user.id,
        where: { month }
      }),
      hoursStore.getHoursFunctional({
        userId: user.id,
        where: {
          month,
          projectNull: true,
        }
      })
    ])

    this.setState({ 
      noProjectHours: groupNoProjectHours(noProjectHours),
      loading: false
    })
  }

  public onCalendarModeChange = (date: moment.Moment, mode: 'year' | 'month') => {
    this.setState({
      calendarMode: mode,
      currDate: date,
    })
  }
}
