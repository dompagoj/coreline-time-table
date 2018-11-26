import { Icon, Layout, Menu } from 'antd'
// tslint:disable-next-line:no-submodule-imports
import { SelectParam } from 'antd/lib/menu'
import { IpcRenderer } from 'electron'
import { css } from 'emotion'
import { observer } from 'mobx-react'
import * as React from 'react'

import { authStore } from '../../stores/AuthStore'
import { routerStore } from '../../stores/router/router-store'

// @ts-ignore
const electron = window.require('electron')
const ipcRenderer: IpcRenderer = electron.ipcRenderer

const siderContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

@observer
export class Navbar extends React.Component<any, { activeMenu: string[] }> {
  public state = {
    activeMenu: [],
  }
  public render() {
    const { activeMenu } = this.state
    if (activeMenu.length === 0) {
      return null
    }

    return (
      <Layout>
        <Layout.Sider theme="dark" defaultCollapsed collapsible>
          <Menu defaultSelectedKeys={this.state.activeMenu} onSelect={this.handleRoute} mode="inline" theme="dark">
            <Menu.Item key="/profile">
              <Icon type="user" />
              {authStore.user && <span>{authStore.user.username}</span>}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="/hours">
              <Icon type="clock-circle" />
              <span>Hours</span>
            </Menu.Item>
            <Menu.Item key="/voting">
              <Icon type="usergroup-add" />
              <span>Voting</span>
            </Menu.Item>
          </Menu>
          <Menu onClick={this.logout} selectable={false} mode="inline" theme="dark">
            <Menu.Item>
              <Icon type="logout" />
              <span>Logout</span>
            </Menu.Item>
          </Menu>
        </Layout.Sider>
      </Layout>
    )
  }
  public componentDidMount = () => {
    const { pathname } = routerStore.location
    this.setState({
      activeMenu: pathname === '/' ? ['/profile'] : [pathname],
    })
  }

  public logout = () => {
    ipcRenderer.on('logout-reply', (event, result) => {
      if (result) {
        authStore.token = undefined
        routerStore.gotoLogin()
      }
    })
    ipcRenderer.send('logout')
  }

  public handleRoute = (e: SelectParam) => {
    this.setState({
      activeMenu: [e.key],
    })
    routerStore.goto(e.key)
  }
}
