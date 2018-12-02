import { action, observable } from 'mobx'

class TerminalStore {
  @observable
  public visible: boolean = false

  @observable
  public input: string

  @observable
  public executed: string[] = []

  @action.bound
  public addExecuted(command: string) {
    this.executed.push(command)
  }
}

export const terminalStore = new TerminalStore()
