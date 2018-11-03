import { Button } from 'antd'
import { IpcRenderer } from 'electron'
import { css } from 'emotion'
import * as React from 'react'

import { authStore } from '../../stores/AuthStore'
import { routerStore } from '../../stores/router/router-store'

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
`

const buttonStyle: React.CSSProperties = {
  background: 'red',
  color: 'white',
  height: '100px',
}

export class GoogleLoginComponent extends React.Component {
  public render() {
    return (
      <div className={buttonContainerStyle}>
        <Button style={buttonStyle} onClick={this.login}>
          Login in with google
        </Button>
      </div>
    )
  }
  public login = () => {
    ipcRenderer.on('reply', (event, arg) => {
      console.log('arg in react', arg) // prints "pong"
      authStore.isLoggedIn = true
      routerStore.gotoHome()
    })
    ipcRenderer.send('login', 'start login')
  }
}
