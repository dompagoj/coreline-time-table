import * as React from 'react'
import { Router } from 'react-router-dom'

import { MainRouter } from './components/router/MainRouter'
import './index.css'
import { history } from './stores/router/router-store'

class App extends React.Component {
  public render() {
    return (
      <Router history={history}>
        <MainRouter />
      </Router>
    )
  }
}

export default App
