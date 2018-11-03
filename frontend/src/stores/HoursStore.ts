import { action, observable } from 'mobx'

class HoursStore {
  @observable
  public users: any

  // @action
  // public async getUsers() {}
}

export const hoursStore = new HoursStore()
