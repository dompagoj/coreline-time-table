import { IpcRenderer } from 'electron'
import * as React from 'react'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom'

import { authStore } from '../stores/AuthStore'
import { GoogleLoginComponent } from './login-forms/GoogleLogin'
import { MainLayout } from './MainLayout'

// @ts-ignore
const electron = window.require('electron')
const ipcRenderer: IpcRenderer = electron.ipcRenderer

export class MainRouterComponent extends React.Component<RouteComponentProps> {
  public render() {
    ipcRenderer.send('jwt')
    return (
      <Switch>
        <Route path="/login" component={GoogleLoginComponent} />
        {!authStore.isLoggedIn && <Redirect to="/login" />}
        <Route path="/" component={MainLayout} />
      </Switch>
    )
  }
  public componentDidMount = () => {
    ipcRenderer.on('jwt-reply', (event, arg) => {
      console.log('token?', arg)
    })
  }
}

export const MainRouter = withRouter(MainRouterComponent)
