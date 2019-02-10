import { Icon, Layout, Menu } from 'antd'
// tslint:disable-next-line:no-submodule-imports
import { SelectParam } from 'antd/lib/menu'
import { IpcRenderer } from 'electron'
import { observer } from 'mobx-react'
import { bind, unbind } from 'mousetrap'
import * as React from 'react'

import { css } from 'emotion'
import { authStore } from '../../stores/AuthStore'
import { generalStateStore } from '../../stores/GeneralState'
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
    activeMenu: []
  }
  public render() {
    const { activeMenu } = this.state
    if (activeMenu.length === 0) {
      return null
    }

    return (
      <Layout className={navbarStyle}>
        <Layout.Sider
          theme={generalStateStore.mode}
          defaultCollapsed
          collapsible
          style={{ backgroundColor: generalStateStore.themeMode.primary }}
        >
          <Menu
            style={{ backgroundColor: generalStateStore.themeMode.primary }}
            selectedKeys={activeMenu}
            onSelect={this.handleRoute}
            mode="inline"
            theme={generalStateStore.mode}
          >
            <Menu.Item key="/profile">
              <Icon type="user" />
              {authStore.user && <span>{authStore.user.username}</span>}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="/hours">
              <Icon type="clock-circle" />
              <span>Hours</span>
            </Menu.Item>
            {authStore.user.type === UserType.EMPLOYER && (
              <Menu.Item key="/employer">
                <Icon type="bar-chart" />
                <span>Employer dashboard</span>
              </Menu.Item>
            )}
            <Menu.Item key="/projects">
              <Icon type="tool" />
              <span>Projects</span>
            </Menu.Item>
          </Menu>
          <Menu
            style={{ backgroundColor: generalStateStore.themeMode.primary }}
            onClick={this.logout}
            selectable={false}
            mode="inline"
            theme={generalStateStore.mode}
          >
            <Menu.Item>
              <Icon type="logout" theme="outlined" />
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
      activeMenu: pathname === '/' ? ['/profile'] : [pathname]
    })
    bind('mod+1', () => {
      this.setActiveTab('/profile')
      routerStore.gotoProfile()
    })
    bind('mod+2', () => {
      this.setActiveTab('/hours')
      routerStore.gotoCalendar()
    })
    if (authStore.user.type === UserType.EMPLOYER) {
      bind('mod+3', () => {
        this.setActiveTab('/employer')
        routerStore.gotoEmployerDashboard()
      })
      bind('mod+4', () => {
        this.setActiveTab('/projects')
        routerStore.gotoProjects()
      })
    } else {
      bind('mod+3', () => {
        this.setActiveTab('/projects')
        routerStore.gotoProjects()
      })
    }
  }
  public componentWillUnmount = () => {
    unbind('mod+1')
    unbind('mod+2')
    unbind('mod+3')
    unbind('mod+4')
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
      activeMenu: [e.key]
    })
    routerStore.goto(e.key)
  }
}

const navbarStyle = css`
  .ant-layout-sider-trigger {
    background-color: ${generalStateStore.themeMode.primary};
  }
`
