import { Icon, Menu } from 'antd'
import { css } from 'emotion'
import { observer } from 'mobx-react'
import * as React from 'react'
import Media from 'react-media'

import { authStore } from '../../stores/AuthStore'
import { routerStore } from '../../stores/router/router-store'

const menuStyleFull = css`
  width: 200px;
  height: 100%;
`
const menuStyleIcons = css`
  width: 60px;
  height: 100;
`

@observer
export class Navbar extends React.Component<any, { activeMenu }> {
  public state = {
    activeMenu: '',
  }
  public render() {
    return (
      <Media query="(max-width: 949px)">{matches => (matches ? this.renderMenuIcons() : this.renderFullMenu())}</Media>
    )
  }
  public handleRoute = e => {
    this.setState({
      activeMenu: e.key,
    })
    routerStore.goto(e.key)
  }
  public renderFullMenu = () => (
    <Menu defaultOpenKeys={[this.state.activeMenu]} className={menuStyleFull} theme="dark" onClick={this.handleRoute}>
      <Menu.Item key="profile">
        <Icon type="user" />
        {authStore.user && authStore.user.firstName}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="hours">
        <Icon type="clock-circle" />
        Hours
      </Menu.Item>
    </Menu>
  )
  public renderMenuIcons = () => (
    <Menu defaultOpenKeys={[this.state.activeMenu]} className={menuStyleIcons} theme="dark" onClick={this.handleRoute}>
      <Menu.Item key="profile">
        <Icon type="user" />
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="hours">
        <Icon type="clock-circle" />
      </Menu.Item>
    </Menu>
  )
  public componentDidMount = () => {
    this.setState({
      activeMenu: routerStore.location.pathname,
    })
  }
}
