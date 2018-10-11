import { Icon, Menu } from 'antd'
import { css } from 'emotion'
import * as React from 'react'
import Media from 'react-media'
import { Route, Switch } from 'react-router-dom'

import { routerStore } from '../../stores/router/router-store'
import { Hours } from '../hours/Hours'

const menuStyleFull = css`
  width: 200px;
  height: 100%;
`
const menuStyleIcons = css`
  width: 60px;
  height: 100;
`
const routerContainer = css`
  margin: 20px;
  width: 100%;
`

export class Navbar extends React.Component {
  public render() {
    return (
      <div style={{ height: '100%', display: 'flex' }}>
        <Media query="(max-width: 949px)">
          {matches =>
            matches ? this.renderMenuIcons() : this.renderFullMenu()
          }
        </Media>
        <div className={routerContainer}>
          <Switch>
            <Route path="/hours" component={Hours} />
          </Switch>
        </div>
      </div>
    )
  }
  public handleRoute = e => {
    routerStore.goto(e.key)
  }
  public renderFullMenu = () => (
    <Menu className={menuStyleFull} theme="dark" onClick={this.handleRoute}>
      <Menu.Item>
        <Icon type="user" />
        Hello dompagoj
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="hours">
        <Icon type="clock-circle" />
        Hours
      </Menu.Item>
      <Menu.Item key="calendar">
        <Icon type="calendar" />
        Calendar
      </Menu.Item>
    </Menu>
  )
  public renderMenuIcons = () => (
    <Menu className={menuStyleIcons} theme="dark" onClick={this.handleRoute}>
      <Menu.Item>
        <Icon type="user" />
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="hours">
        <Icon type="clock-circle" />
      </Menu.Item>
      <Menu.Item key="calendar">
        <Icon type="calendar" />
      </Menu.Item>
    </Menu>
  )
}
