import * as moment from 'moment'

import { Hour } from '../../data/entities/Hour'
import { Project } from '../../data/entities/Project'
import { User } from '../../data/entities/User'
import { Context } from '../../data/types/Context'
import { HourInput } from '../../data/types/HourTypes'
import { Route } from '../../data/types/routing'
import { GET, POST, PUT } from '../controller-decorators'
import { validateBody } from '../middlewares/validate-body'
import { BaseController } from './BaseController'

export class HourController extends BaseController<
  Context,
  { companyId: string; userId: string; dateId?: string },
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

  @GET('/:dateId')
  public async one() {
    const { dateId } = this.routeData
    const { user } = this.locals

    const date = new Date(dateId)
    Hour.findOneOrFail({
      where: {
        date,
        userId: user.id,
      },
    })
      .then(hour => this.accepted(moment(hour.date).month()))
      .catch(e => this.badRequest(`No hour with id ${dateId} found`))
  }

  @POST('/')
  public async create({ date, hours }: HourInput) {
    const { user } = this.locals
    const { amount, projects } = hours
    if (projects) {
      await Promise.all(
        projects.map(async project => {
          const dbProject = await Project.findOneOrFail(project.projectId)
          dbProject.hours += project.hours
          await dbProject.save()
        }),
      )
    }

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
  public async update({ date, hours }: HourInput) {
    const { user } = this.locals
    this.badRequest('Not yet implemented')
  }
}
