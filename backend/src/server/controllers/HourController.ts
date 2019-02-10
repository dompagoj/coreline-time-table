import moment from 'moment'

import { getRepository } from 'typeorm'
import { Hour } from '../../data/entities/Hour'
import { User } from '../../data/entities/User'
import { Context } from '../../data/types/Context'
import { CreateHourInput, UpdateHourInput } from '../../data/types/HourTypes'
import { DELETE, GET, POST, PUT } from '../controller-decorators'
import { BaseController } from './BaseController'

export class HourController extends BaseController<
  Context & { user: User },
  { companyId: string; userId: string; dateId: string; id: string }
> {
  public constructor(req, res, next) {
    super(req, res, next)
  }

  @GET('/')
  public async all() {
    const { user } = this.ctx
    const hours = await getRepository(Hour)
      .createQueryBuilder('hour')
      .where('EXTRACT(month from hour.date) = :month',
        { month: this.req.query.month || moment().month() + 1 })
      .andWhere('hour.user_id = :userId', { userId: user.id })
      .getMany()

    this.accepted(hours)
  }

  @GET('/:dateId')
  public async one() {
    const { dateId } = this.routeData
    const { user } = this.ctx

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
  public async create({ date: rawDate, hours }: CreateHourInput) {
    const { user } = this.ctx
    const date = moment(rawDate).utc().add(1, 'day').format('YYYY-MM-DD')

    const hour = await Hour.create({
      date,
      ...hours,
      userId: user.id,
    }).save()

    return this.accepted(hour)
  }

  @PUT('/:id')
  public async update(hours: UpdateHourInput) {
    const { id } = this.routeData
    const hour = await Hour.findOne(id)
    if (!hour) {
      return this.badRequest(`No hour with id ${id} found`)
    }
    Object.assign(hour, hours)
    await hour.save()

    return this.accepted(hour)
  }

  // @PUT('/')
  // public async updateOrCreate({ date: rawDate, hours }: HourInput) {
  //   const { user } = this.ctx
  //   const { amount, projectId, description } = hours
  //   const date = moment(rawDate).utc().add(1, 'day').format('YYYY-MM-DD')

  //   const hour = await Hour.findOne({
  //     where: {
  //       date,
  //       userId: user.id,
  //     },
  //   })
  //   if (hour) {
  //     hour.amount = amount
  //     hour.projectId = projectId || hour.projectId
  //     hour.description = description || hour.description
  //     await hour.save()

  //     return this.accepted({ hour, updated: true })
  //   }

  //   Hour.create({
  //     amount,
  //     date,
  //     userId: user.id,
  //     projectId,
  //     description,
  //   })
  //     .save()
  //     .then(created => this.accepted(created))
  // }

  @DELETE('/:id')
  public async deleteHour() {
    const { id } = this.routeData
    await Hour.delete(id)

    return this.accepted()
  }

  @GET('/projects')
  public async getHourswithProjects() {
    const { userId } = this.routeData
    const hours = await getRepository(Hour)
      .createQueryBuilder('hour')
      .leftJoinAndSelect('hour.project', 'project')
      .where('EXTRACT(month from hour.date) = :month',
        { month: this.req.query.month || moment().month() + 1 })
      .andWhere('hour.user_id = :userId', { userId })
      .getMany()

    return this.accepted()
  }
}
