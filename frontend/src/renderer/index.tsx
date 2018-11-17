import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Router } from 'react-router'

import { MainRouter } from './components/MainRouter'
import './index.css'
import { history } from './stores/router/router-store'

const rootDocument = document.getElementById('root') || document.getElementById('app')

ReactDOM.render(
  <Router history={history}>
    <MainRouter />
  </Router> ,
  rootDocument as HTMLElement,
)
