import { Request, Response, Router } from 'express'
import { Route } from '../../data/types/routing'

export abstract class BaseController {
  protected req: Request
  protected res: Response
  protected routeData: any
  protected url: string

  constructor(req: Request, res: Response) {
    this.req = req
    this.res = res
    this.routeData = req.params
    this.url = req.url
  }
  protected accepted(object: object | object[]) {
    this.res
      .status(200)
      .json(object)
      .end()
  }
  protected badRequest() {
    this.res.status(400).end()
  }
}
