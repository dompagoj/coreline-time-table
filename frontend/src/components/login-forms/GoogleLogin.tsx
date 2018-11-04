import { Alert, Button } from 'antd'
import { IpcRenderer } from 'electron'
import { css } from 'emotion'
import * as React from 'react'

import { authStore } from '../../stores/AuthStore'
import { routerStore } from '../../stores/router/router-store'
import { LoginResponse } from '../../types/login-response'

// @ts-ignore
const electron = window.require('electron')
const ipcRenderer: IpcRenderer = electron.ipcRenderer

const buttonContainerStyle = css`
  height: 500px;
  width: 500px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -250px;
  margin-left: -250px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const buttonStyle: React.CSSProperties = {
  background: 'red',
  color: 'white',
  height: '100px',
  width: '100%',
}

export class GoogleLoginComponent extends React.Component<any, { error: string | null }> {
  public state = {
    error: null,
  }
  public render() {
    const { error } = this.state

    return (
      <div className={buttonContainerStyle}>
        <Button style={buttonStyle} onClick={this.login}>
          Login in with google
        </Button>
        {error && (
          <Alert
            style={{ width: '100%', marginTop: '20px' }}
            message="Error"
            description={this.state.error}
            type="error"
            showIcon
            closable
            onClose={this.closePopup}
          />
        )}
      </div>
    )
  }
  public login = async () => {
    ipcRenderer.on('reply', async (event, arg) => {
      authStore.user = arg.user
      routerStore.gotoHome()
    })
    ipcRenderer.send('login')
  }
  public closePopup = () => {
    this.setState({
      error: null,
    })
  }
}
