import { NextFunction, Request, Response } from 'express'

export abstract class BaseController<Context = any, Params = any> {
  protected req: Request & { ctx: Context }
  protected res: Response
  protected next: NextFunction
  protected routeData: Params
  protected url: string
  protected ctx: Context

  public constructor(req: Request & { ctx: Context }, res: Response, next: NextFunction) {
    this.req = req
    this.res = res
    this.next = next
    this.routeData = req.params
    this.url = req.url
    this.ctx = res.locals
  }
  protected accepted<U>(object?: U, format?: (object: U) => any) {
    if (!object) {
      return this.res.status(200).end()
    }
    if (typeof object === 'string' && !format) {
      return this.res
        .status(200)
        .json({ data: object })
        .end()
    }

    return this.res
      .status(200)
      .json(format ? format(object) : object)
      .end()
  }
  protected badRequest<U>(error?: U, format?: (object: U) => any) {
    if (!error) {
      return this.res
        .status(400)
        .json({
          error: 'Something went wrong...',
        })
        .end()
    }
    if (typeof error === 'string' && !format) {
      return this.res
        .status(400)
        .json({ error })
        .end()
    }

    return this.res
      .status(400)
      .json(format ? format(error) : error)
      .end()
  }

  protected unauthorized() {
    return this.res.status(401).end()
  }

  protected redirect(redirectTo?: string) {
    if (redirectTo)
      return this.res
        .status(302)
        .redirect(redirectTo)

    return this.res
      .status(302)
      .end()
  }
}
