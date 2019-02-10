import { computed, observable } from 'mobx'

class GeneralState {
  @observable
  public userSearchInput: string

  @observable
  public mode: 'dark' | 'light' = 'dark'

  @computed
  get themeMode() {
    if (this.mode === 'dark') {
      return {
        primary: 'rgb(30, 30, 30)',
        secondary: '#363636'
      }
    }

    return {
      primary: 'white',
      secondary: '#001168'
    }
  }
}

export const generalStateStore = new GeneralState()
