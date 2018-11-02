import { ID } from './random'

export interface Context {
  user: {
    id: ID
    email: string,
  }
}
