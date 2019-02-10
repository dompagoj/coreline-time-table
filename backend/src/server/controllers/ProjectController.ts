import moment = require('moment')
import { getRepository } from 'typeorm'
import { Company } from '../../data/entities/Company'
import { Project } from '../../data/entities/Project'
import { ProjectStatus } from '../../data/enums/ProjectStatus'
import { Context } from '../../data/types/Context'
import { CreateProjectInput, UpdateProjectInput } from '../../data/types/ProjectTypes'
import { DELETE, GET, POST, PUT } from '../controller-decorators'
import { verifyUser } from '../middlewares/auth'
import { BaseController } from './BaseController'

export class ProjectController extends BaseController<
  Context & { company: Company },
  { companyId: string; id: string, userId: string }
> {
  constructor(req, res, next) {
    super(req, res, next)
  }

  @GET('/')
  public async all() {
    const { companyId } = this.routeData
    const projects = await Project.find({
      where: {
        companyId,
      },
      relations: ['hours'],
    })

    return this.accepted(projects)
  }

  @POST('/')
  public async create({ name, avatar, status }: CreateProjectInput) {
    const { companyId } = this.routeData
    const project = await Project.create({
      name,
      avatar,
      status: status || ProjectStatus.ACTIVE,
      companyId: parseInt(companyId, 10),
    }).save()

    return this.accepted(project)
  }

  @PUT('/:id')
  public async update({ name, status }: UpdateProjectInput) {
    const { id } = this.routeData
    const project = await Project.findOne(id)
    if (!project) {
      return this.badRequest({ error: `No project with id: "${id}"` })
    }
    project.name = name || project.name
    project.status = status || project.status
    await project.save()

    return this.accepted(project)
  }

  @DELETE('/:id')
  public async delete() {
    const { id } = this.routeData
    await Project.delete(id)

    return this.accepted()
  }

  @GET('/hours/:userId', {
    before: verifyUser,
  })
  public async userProjectswithHours() {
    const { user } = this.ctx
    const projects = await getRepository(Project)
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.hours', 'hour')
      .where('EXTRACT(month from hour.date) = :month',
        { month: this.req.query.month || moment().month() + 1 })
      .andWhere('hour.user_id = :userId', { userId: user.id })
      .getMany()

    return this.accepted(projects)
  }
}
