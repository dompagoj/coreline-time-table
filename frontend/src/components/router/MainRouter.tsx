import * as React from 'react'
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom'

import { MainLayout } from '../MainLayout'
import { Login } from '../register-form/Login'
import { isLoggedIn } from '../utils/auth'

export class MainRouterComponent extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={MainLayout} />
      </Switch>
    )
  }
}

export const MainRouter = withRouter(MainRouterComponent)
