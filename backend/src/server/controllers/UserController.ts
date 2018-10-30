import { User } from '../../data/entities/User'
import { UserRequest } from '../../data/types/express'
import { Route } from '../../data/types/routing'
import { UserCreateInput } from '../../data/types/UserTypes'
import { validateInput } from '../../utils/helper-functions'
import { DELETE, GET, POST } from '../controller-decorators'
import { BaseController } from './BaseController'

export class UserController extends BaseController<UserRequest> {
  public static routes: Route[] = []

  constructor(req, res) {
    super(req, res)
  }
  @GET('/')
  public async all() {
    const { companyId } = this.req.params
    const users = await User.find({
      where: { companyId },
    })

    return this.accepted(users)
  }
  @GET('/:id')
  public async one() {
    const { companyId } = this.req.params
    const user = await User.findOne({
      where: {
        id: this.req.params.id,
        companyId,
      },
    })

    return this.accepted(user)
  }
  @POST('/')
  public async create() {
    const { type, username, companyId } = this.req.body
    const userInput = new UserCreateInput(username, type, companyId)
    const { errors } = await validateInput(userInput)
    if (errors) {
      return this.badRequest(errors)
    }
    const user = await User.create({
      username,
      type,
      companyId,
    }).save()

    return this.accepted(user)
  }
  @DELETE('/:id')
  public async delete() {
    const deletedUser = await User.delete(this.req.params.id)

    return this.accepted(deletedUser)
  }
}
