import { Company } from '../../data/entities/Company'
import { User } from '../../data/entities/User'
import { UserType } from '../../data/enums/UserType'
import { Context } from '../../data/types/Context'
import { UserInput, UserUpdateInput } from '../../data/types/UserTypes'
import { DELETE, GET, POST, PUT } from '../controller-decorators'
import { validateBody } from '../middlewares/validate-body'
import { BaseController } from './BaseController'

export class UserController extends BaseController<Context, { companyId: string; id: string }, { company: Company }> {
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
    const { googleToken, ...userData } = user

    return this.accepted(userData)
  }
  @PUT('/:id')
  public async update({ username, type, authKey, avatar }: UserUpdateInput) {
    const { id } = this.routeData
    const { company } = this.locals
    const user = await User.findOne(id)

    if (type === UserType.EMPLOYER) {
      if (company.authKey !== authKey) {
        return this.badRequest({ error: 'Wrong password' })
      }
    }
    user.username = username
    user.type = type
    user.avatar = avatar
    await user.save()

    this.accepted(user)
  }

  @DELETE('/:id')
  public async delete() {
    User.delete(this.req.params.id)
      .then(this.accepted)
      .catch(() => this.badRequest())
  }
}
