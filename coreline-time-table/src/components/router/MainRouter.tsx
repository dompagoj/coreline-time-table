import * as React from 'react'
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom'

import { Navbar } from '../navbar/Navbar'
import { Login } from '../register-form/Login'
import { isLoggedIn } from '../utils/auth'

export class MainRouterComponent extends React.Component<RouteComponentProps> {
  public render() {
    const { location } = this.props

    return (
      <>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" component={Navbar} />
        </Switch>
      </>
    )
  }
}

export const MainRouter = withRouter(MainRouterComponent)
