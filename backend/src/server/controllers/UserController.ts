import { Company } from '../../data/entities/Company'
import { User } from '../../data/entities/User'
import { UserType } from '../../data/enums/UserType'
import { Context } from '../../data/types/Context'
import { UserUpdateInput } from '../../data/types/UserTypes'
import { DELETE, GET, POST, PUT } from '../controller-decorators'
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
      select: ['id', 'avatar', 'email', 'username'],
    })

    return this.accepted(users)
  }

  @GET('/:id')
  public async one() {
    const { company } = this.locals
    const { id } = this.routeData

    const user = await User.findOne({
      where: {
        id,
        companyId: company.id,
      },
    })
    if (!user) {
      return this.badRequest({ error: 'No user found' })
    }
    const { googleToken, ...userData } = user
    if (user.type === UserType.EMPLOYER) {
      return this.accepted({ user: userData, authKey: company.authKey })
    }
    return this.accepted({ user: userData, authKey: '' })
  }

  @PUT('/:id')
  public async update({ username, type, authKey, avatar }: UserUpdateInput) {
    const { id } = this.ctx.user

    const { company } = this.locals
    const user = await User.findOne(id)

    if (type === UserType.EMPLOYER) {
      if (company.authKey !== authKey) {
        return this.badRequest({ error: 'Wrong password' })
      }
    }
    user.username = username
    user.type = type
    user.avatar = avatar ? avatar : user.avatar
    await user.save()

    return this.accepted(user)
  }

  @DELETE('/:id')
  public async delete() {
    User.delete(this.req.params.id)
      .then(this.accepted)
      .catch(this.badRequest)
  }
}
