import { NextFunction, Request, Response } from 'express'

export interface DecoratorOptions {
  before?: Array<(req: Request, res: Response, next: NextFunction) => void>,
  after?: Array<(req: Request, res: Response, next: NextFunction) => void>,
}
