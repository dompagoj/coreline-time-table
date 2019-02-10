import moment from 'moment'

import { getRepository } from 'typeorm'
import { Hour } from '../../data/entities/Hour'
import { User } from '../../data/entities/User'
import { Context } from '../../data/types/Context'
import { CreateHourInput, UpdateHourInput } from '../../data/types/HourTypes'
import { DELETE, GET, POST, PUT } from '../controller-decorators'
import { BaseController } from './BaseController'
import { getArray } from '../../utils/utils';
import { Project } from '../../data/entities/Project';

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
    const { month, include, projectNull } = this.req.query
    const builder = Hour
      .createQueryBuilder('hour')
      .where('EXTRACT(month from hour.date) = :month',
        { month: month || moment().month() + 1 })
      .andWhere('hour.user_id = :userId', { userId: user.id })

    if (projectNull) {
      builder.andWhere('hour.project_id is null')
    }

    if (include) {
      getArray(include).forEach(i => {
        builder.leftJoinAndSelect(`hour.${i}`, i)
      })
    }
    const hours = await builder.getMany()
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
      .catch(() => this.badRequest(`No hour with id ${dateId} found`))
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
    const project = await Project.findOne(hours.projectId)
    hour.project = project
    await hour.save()

    return this.accepted(hour)
  }

  @DELETE('/')
  public async deleteHour() {
    const { ids } = this.req.query
    if (!Array.isArray(ids)) {
      await Hour.delete(ids)

      return this.accepted()
    }
    await getRepository(Hour)
      .createQueryBuilder('hour')
      .delete()
      .where('hour.id IN (:...ids)', { ids })
      .execute()

    return this.accepted()
  }
}
