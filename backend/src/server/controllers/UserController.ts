import { Request, Response, Router } from 'express'

import { User } from '../../data/entities/User'
import { Route } from '../../data/types/routing'
import { BaseController } from './BaseController'

export class UserController extends BaseController {
  public static registerRoutes(router: Router) {
    this.routes.forEach(route => {
      router[route.method](route.route, (req, res) => {
        const controller = new UserController(req, res)
        const result = controller[route.action]()
        if (result instanceof Promise) {
          result.then().catch(e => console.error(e))
        }
      })
    })
  }
  private static routes: Route[] = [
    {
      route: '/',
      method: 'get',
      action: 'all',
    },
  ]
  constructor(req: Request, res: Response) {
    super(req, res)
  }

  public async all() {
    const users = await User.find()
    this.accepted(users)
  }
  public async one() {
    return User.findOne(this.req.params.id)
  }
  public async create() {
    return User.create(this.req.body).save()
  }
  public async delete() {
    return User.delete(this.req.params.id)
  }
}
