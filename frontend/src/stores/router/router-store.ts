import { createBrowserHistory } from 'history'
import { action } from 'mobx'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'

const browserHistory = createBrowserHistory()

export class MobxRouterStore extends RouterStore {
  @action.bound
  public goto(path: string) {
    this.history.push(`/${path}`)
  }

  @action.bound
  public gotoHome() {
    this.history.push('/')
  }
}

export const routerStore = new MobxRouterStore()
export const history = syncHistoryWithStore(browserHistory, routerStore)
