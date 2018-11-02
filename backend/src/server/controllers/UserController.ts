import { User } from '../../data/entities/User'
import { Context } from '../../data/types/Context'
import { UserInput } from '../../data/types/UserTypes'
import { DELETE, GET, POST } from '../controller-decorators'
import { validateBody } from '../middlewares/validate-body'
import { BaseController } from './BaseController'

export class UserController extends BaseController<Context, { companyId: string }> {
  constructor(req, res, next) {
    super(req, res, next)
  }

  @GET('/')
  public async all() {
    const { companyId } = this.routeData
    const users = await User.find({
      where: { companyId },
    })
    this.accepted(users)
  }
  @GET('/:id')
  public async one() {
    const { companyId } = this.routeData
    const { id } = this.req.params
    const user = await User.findOne({
      where: {
        id,
        companyId,
      },
    })

    return this.accepted(user)
  }
  @POST('/', { before: validateBody(UserInput) })
  public async create({ type, username }: UserInput) {
    const companyId = parseInt(this.routeData.companyId, 10)
    const user = await User.create({
      username,
      type,
      companyId,
    }).save()

    return this.accepted(user)
  }
  @DELETE('/:id')
  public async delete() {
    User.delete(this.req.params.id)
      .then(() => {
        return this.accepted()
      })
      .catch(() => {
        return this.badRequest()
      })
  }
}
