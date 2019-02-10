import { css } from 'emotion'
import { observer } from 'mobx-react'
import * as Mousetrap from 'mousetrap'
import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { authStore } from '../stores/AuthStore'
import { terminalStore } from '../stores/TerminalStore'
import { UserType } from '../types/enums'
import { EmployerDashboard } from './employeer-hours/EmployerDashboard'
import { Hours } from './hours/Hours'
import { Navbar } from './navbar/Navbar'
import { Profile } from './profile/Profile'
import { Projects } from './projects/Projects'
import { Terminal } from './terminal/Terminal'
import { UserDashboard } from './user-dashboard/UserDashboard'

const routerContainer = css`
  width: 100%;
`

@observer
export class MainLayout extends React.Component {
  public render() {
    if (authStore.loading) {
      return null
    }

    return (
      <div style={{ height: '100%', display: 'flex' }}>
        <Navbar />
        <div className={routerContainer}>
          <Switch>
            <Redirect exact from="/" to="/profile" />
            <Route path="/profile" component={Profile} />
            <Route path="/hours" component={Hours} />
            <Route path="/employer" component={EmployerDashboard} />
            <Route path="/user-dashboard" component={UserDashboard} />
            <Route path="/projects" component={Projects} />
          </Switch>
          {terminalStore.visible && <Terminal />}
        </div>
      </div>
    )
  }
  public async componentDidMount() {
    if (!authStore.user) {
      await authStore.getUser()
    }
    Mousetrap.prototype.stopCallback = () => false
    Mousetrap.bind('mod+t', () => {
      const { visible } = terminalStore
      terminalStore.visible = !visible
    })
  }
}
