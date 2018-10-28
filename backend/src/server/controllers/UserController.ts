import { Response } from 'express'

import { User } from '../../data/entities/User'
import { GenericRequest, UserRequest } from '../../data/types/express'
import { Route } from '../../data/types/routing'
import { UserCreateInput } from '../../data/types/UserTypes'
import { validateInput } from '../../utils/helper-functions'
import { DELETE, GET, POST } from '../controller-decorators'
import { BaseController } from './BaseController'

export class UserController extends BaseController<UserRequest> {
  public static routes: Route[] = []
  private companyId: number

  constructor(req: GenericRequest<UserRequest>, res: Response) {
    super(req, res)
    this.companyId = req.companyId
  }
  @GET('/')
  public async all() {
    console.log('company id', this.req.companyId)
    const users = await User.find({
      where: { companyId: this.companyId },
    })

    return this.accepted(users)
  }
  @GET('/:id')
  public async one() {
    const user = await User.findOne({
      where: {
        id: this.req.params.id,
        companyId: this.companyId,
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
