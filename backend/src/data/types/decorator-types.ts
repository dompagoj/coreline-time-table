import { NextFunction, Request, Response } from 'express'
import { ExpressFunction } from './express'

export interface DecoratorOptions {
  before?: ExpressFunction[] | ExpressFunction
  after?: ExpressFunction[] | ExpressFunction
}
