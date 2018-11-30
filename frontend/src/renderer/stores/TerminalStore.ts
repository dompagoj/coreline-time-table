import { observable } from 'mobx'

class TerminalStore {
  @observable
  public visible: boolean = false
}

export const terminalStore = new TerminalStore()
