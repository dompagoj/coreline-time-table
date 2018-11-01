import { Response } from 'express'
import { GenericRequest } from '../../data/types/express'

export abstract class BaseController<T> {
  protected req: GenericRequest<T>
  protected res: Response
  protected routeData
  protected url: string

  constructor(req: GenericRequest<T>, res: Response) {
    this.req = req
    this.res = res
    this.routeData = req.params
    this.url = req.url
  }
  protected accepted(object?: object | object[]) {
    if (!object) {
      return this.res.status(200).end()
    }
    return this.res
      .status(200)
      .json(object)
      .end()
  }
  protected badRequest(error?: object | object[]) {
    if (error) {
      return this.res
        .status(400)
        .json(error)
        .end()
    }
    return this.res.status(400).end()
  }
}
