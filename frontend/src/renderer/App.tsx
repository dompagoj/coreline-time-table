import * as React from 'react'
import { Router } from 'react-router'

import { MainRouter } from './components/MainRouter'
import { history } from './stores/router/router-store'

class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <MainRouter />
      </Router>
    )
  }
}

export default App
