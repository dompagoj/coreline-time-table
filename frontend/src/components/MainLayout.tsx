import { css } from 'emotion'
import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Navbar } from './navbar/Navbar'

import { observer } from 'mobx-react'
import { authStore } from '../stores/AuthStore'
import { Hours } from './hours/Hours'
import { Profile } from './profile/Profile'
import { Voting } from './voting/Voting'

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
            <Route path="/voting" component={Voting} />
          </Switch>
        </div>
      </div>
    )
  }
  public componentDidMount() {
    if (!authStore.user) {
      authStore.getUser()
    }
  }
}
