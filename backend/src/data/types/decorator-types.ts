import { ExpressFunction } from './express'

export interface DecoratorOptions {
  before?: ExpressFunction[] | ExpressFunction
  after?: ExpressFunction[] | ExpressFunction
}
