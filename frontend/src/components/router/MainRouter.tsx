import * as React from 'react'
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom'

import { GoogleLoginComponent } from '../login-forms/GoogleLogin'
import { MainLayout } from '../MainLayout'

export class MainRouterComponent extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <Switch>
        <Route path="/login" component={GoogleLoginComponent} />
        <Route path="/" component={MainLayout} />
      </Switch>
    )
  }
}

export const MainRouter = withRouter(MainRouterComponent)
