import { createHashHistory } from 'history'
import { action } from 'mobx'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'

const hashHistory = createHashHistory()

export class MobxRouterStore extends RouterStore {
  @action
  public goto(path: string) {
    this.history.push(`${path}`)
  }

  @action
  public gotoHome() {
    this.history.push('/')
  }

  @action
  public gotoProfile() {
    this.history.push('/profile')
  }

  @action
  public gotoCalendar() {
    this.history.push('/hours')
  }

  @action
  public gotoEmployerDashboard() {
    this.history.push('/employer')
  }

  public gotoProjects() {
    this.history.push('/projects')
  }

  @action
  public gotoLogin() {
    this.history.push('/login')
  }
}

export const routerStore = new MobxRouterStore()
export const history = syncHistoryWithStore(hashHistory, routerStore)
