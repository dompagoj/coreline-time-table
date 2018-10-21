import { css } from 'emotion'
import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Navbar } from './navbar/Navbar'

import { Hours } from './hours/Hours'

const routerContainer = css`
  margin: 20px;
  width: 100%;
`

export class MainLayout extends React.Component {
  public render() {
    return (
      <div style={{ height: '100%', display: 'flex' }}>
        <Navbar />
        <div className={routerContainer}>
          <Switch>
            <Route path="/hours" component={Hours} />
          </Switch>
        </div>
      </div>
    )
  }
}
