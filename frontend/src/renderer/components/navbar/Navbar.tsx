import { Icon, Layout, Menu } from 'antd'
// tslint:disable-next-line:no-submodule-imports
import { SelectParam } from 'antd/lib/menu'
import { IpcRenderer } from 'electron'
import { css } from 'emotion'
import { observer } from 'mobx-react'
import { bind, unbind } from 'mousetrap'
import * as React from 'react'

import { authStore } from '../../stores/AuthStore'
import { routerStore } from '../../stores/router/router-store'
import { UserType } from '../../types/enums'

// @ts-ignore
const electron = window.require('electron')
const ipcRenderer: IpcRenderer = electron.ipcRenderer

interface State {
  activeMenu: string[]
}

@observer
export class Navbar extends React.Component<any, State> {
  public state: State = {
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
          <Menu selectedKeys={activeMenu} onSelect={this.handleRoute} mode="inline" theme="dark">
            <Menu.Item key="/profile">
              <Icon type="user" />
              {authStore.user && <span>{authStore.user.username}</span>}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="/hours">
              <Icon type="clock-circle" />
              <span>{authStore.user.type === UserType.EMPLOYEE ? 'Hours' : 'Employer dashboard'}</span>
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
    bind('mod+1', () => {
      this.setActiveTab('/profile')
      routerStore.gotoProfile()
    })
    bind('mod+2', () => {
      this.setActiveTab('/hours')
      routerStore.gotoCalendar()
    })
    bind('mod+3', () => {
      this.setActiveTab('/voting')
      routerStore.gotoVoting()
    })
  }
  public componentWillUnmount = () => {
    unbind('mod+1')
    unbind('mod+2')
    unbind('mod+3')
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
  public setActiveTab = (tab: string) => {
    this.setState({ activeMenu: [tab] })
  }

  public handleRoute = (e: SelectParam) => {
    this.setState({
      activeMenu: [e.key],
    })
    routerStore.goto(e.key)
  }
}
