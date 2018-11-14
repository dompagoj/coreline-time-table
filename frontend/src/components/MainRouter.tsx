import { IpcRenderer } from 'electron'
import * as React from 'react'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom'

import { observer } from 'mobx-react'
import { axios } from '../http/axios'
import { authStore } from '../stores/AuthStore'
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
      return <Spinner />
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
        authStore.token = token
        axios.defaults.headers.token = token
      }
      this.setState({ loading: false })
    })
    ipcRenderer.send('jwt')
  }
}

export const MainRouter = withRouter(MainRouterComponent)
