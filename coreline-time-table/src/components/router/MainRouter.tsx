import * as React from 'react'
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom'

import { Login } from '../register-form/Login'
import { isLoggedIn } from '../utils/auth'

const hello = () => <div>Hello world!</div>

export class MainRouterComponent extends React.Component<RouteComponentProps> {
  public render() {
    const { location } = this.props

    return (
      <>
        <Switch>
          <Redirect exact path="/" to="/login" />
          <Route path="/login" component={Login} />
          <Route path="/home" component={hello} />
        </Switch>
      </>
    )
  }
}

export const MainRouter = withRouter(MainRouterComponent)
