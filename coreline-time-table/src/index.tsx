import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'

import { MainRouter } from './components/router/MainRouter'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import { history } from './stores/router/router-store'

ReactDOM.render(
  <Router history={history}>
    <MainRouter />
  </Router> ,
  document.getElementById('root') as HTMLElement,
)
registerServiceWorker()
