import { IpcRenderer } from 'electron'
import * as React from 'react'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom'

import { decode } from 'jsonwebtoken'
import { observer } from 'mobx-react'
import { authStore } from '../stores/AuthStore'
import { routerStore } from '../stores/router/router-store'
import { GoogleLoginComponent } from './login-forms/GoogleLogin'
import { MainLayout } from './MainLayout'
import { Spinner } from './spinner/Spinner'

// @ts-ignore
const electron = window.require('electron')
const ipcRenderer: IpcRenderer = electron.ipcRenderer

@observer
export class MainRouterComponent extends React.Component<RouteComponentProps, { loading: boolean }> {
  public state = {
    loading: true,
  }
  public render() {
    if (this.state.loading) {
      return (
        <Spinner />
      )
    }

    return (
      <Switch>
        <Route exact path="/login" component={GoogleLoginComponent} />
        {!authStore.isLoggedIn && <Redirect to="/login" />}
        <Route path="/" component={MainLayout} />
      </Switch>
    )
  }
  public componentDidMount = () => {
    ipcRenderer.on('jwt-reply', (event, token) => {
      if (token) {
        const { email, id, type }: any = decode(token.toString('utf-8'), { json: true })
        authStore.token = token
        routerStore.gotoHome()
      }
      this.setState({ loading: false })
    })
    ipcRenderer.send('jwt')
  }
}

export const MainRouter = withRouter(MainRouterComponent)
