import { css } from 'emotion'
import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Navbar } from './navbar/Navbar'

import { observer } from 'mobx-react'
import { authStore } from '../stores/AuthStore'
import { Hours } from './hours/Hours'
import { Spinner } from './spinner/Spinner'

const routerContainer = css`
  margin: 20px;
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
            <Route path="/profile" component={test} />
            <Route path="/hours" component={Hours} />
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

const test = () => (
  <div>
    <h1>Helo world</h1>
  </div>
)
