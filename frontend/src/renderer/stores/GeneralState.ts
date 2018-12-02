import { observable } from 'mobx'

class GeneralState {
  @observable
  public userSearchInput: string
}

export const generalStateStore = new GeneralState()
