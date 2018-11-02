import { Hour } from '../../data/entities/Hour'
import { User } from '../../data/entities/User'
import { Context } from '../../data/types/Context'
import { Route } from '../../data/types/routing'
import { GET, POST } from '../controller-decorators'
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
    const hours = Hour.find({
      where: {
        user,
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
        user,
      },
    })
      .then(hour => this.accepted(hour))
      .catch(e => this.badRequest(`No hour with id ${id} found`))
  }

  @POST('/')
  public async create() {
    console.log('wip')
  }
}
