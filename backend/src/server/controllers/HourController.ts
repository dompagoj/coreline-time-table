import * as moment from 'moment'

import { Hour } from '../../data/entities/Hour'
import { User } from '../../data/entities/User'
import { Context } from '../../data/types/Context'
import { HourInput } from '../../data/types/HourTypes'
import { Route } from '../../data/types/routing'
import { GET, POST, PUT } from '../controller-decorators'
import { BaseController } from './BaseController'

export class HourController extends BaseController<
  Context,
  { companyId: string; userId: string; id: string },
  { user: User }
> {
  public static routes: Route[] = []

  public constructor(req, res, next) {
    super(req, res, next)
  }

  @GET('/')
  public async all() {
    const { user } = this.locals
    const hours = await Hour.find({
      where: {
        userId: user.id,
      },
    })
    this.accepted(hours)
  }

  @GET('/:id')
  public async one() {
    const { id } = this.routeData
    const { user } = this.locals
    Hour.findOneOrFail({
      where: {
        id,
        userId: user.id,
      },
    })
      .then(hour => this.accepted(moment(hour.date).month()))
      .catch(e => this.badRequest(`No hour with id ${id} found`))
  }

  @POST('/')
  public async create({ date, amount }: HourInput) {
    const { user } = this.locals
    Hour.create({
      amount,
      date,
      userId: user.id,
    })
      .save()
      .then(hour => this.accepted(hour))
      .catch(e => this.badRequest(`Hours have already been saved`))
  }

  @PUT('/:id')
  public async update({ date, amount }: HourInput) {
    const { user } = this.locals
    this.badRequest('Not yet implemented')
  }
}
