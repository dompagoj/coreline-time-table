import { Request, Response, Router } from 'express'

import { Company } from '../../data/entities/Company'
import { User } from '../../data/entities/User'
import { Route } from '../../data/types/routing'
import { UserCreateInput } from '../../data/types/UserTypes'
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
    {
      route: '/',
      method: 'post',
      action: 'create',
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
    const { type, username }: UserCreateInput = this.req.body
    const company = await Company.findOne(1)

    const user = await User.create({
      username,
      type,
      company: Promise.resolve(company),
    }).save()

    return this.accepted(user)
  }
  public async delete() {
    return User.delete(this.req.params.id)
  }
}
