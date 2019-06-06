import multer from 'multer'
import { Company } from '../../data/entities/Company'
import { User } from '../../data/entities/User'
import { UserType } from '../../data/enums/UserType'
import { Context } from '../../data/types/Context'
import { UserUpdateInput } from '../../data/types/UserTypes'
import { DELETE, GET, PUT, POST } from '../controller-decorators'
import { BaseController } from './BaseController'
import { MB } from '../constants';
import { uploadProfileImage } from '../services/GStorage';

export class UserController extends BaseController<Context & { company: Company }, { companyId: string; id: string }> {
  public constructor(req, res, next) {
    super(req, res, next)
  }

  @GET('/')
  public async all() {
    const { companyId } = this.routeData

    const users = await User.find({
      where: { companyId, ...this.req.query },
    })

    return this.accepted(users)
  }

  @GET('/:id')
  public async one() {
    const { company } = this.ctx
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
    if (user.type === UserType.EMPLOYER) {
      return this.accepted({ user, authKey: company.authKey })
    }

    return this.accepted({ user, authKey: '' })
  }

  @POST('/:id/avatar', {
    before: [
      multer({ limits: { fileSize: 10 * MB } }).single('avatar'),
      uploadProfileImage,
    ]
  })
  public async updateAvatar() {
    try {
      // @ts-ignore
      const { url } = this.req.file

      if (!url) {
        return this.badRequest()
      }
      const { id } = this.routeData
      await User.update(id, {
        avatar: url 
      })

      // @ts-ignore
      return this.accepted({ url })
    }
    catch (e) {
      console.log(e)
      return this.badRequest()
    }
  }

  @PUT('/:id')
  public async update({ username, type, authKey }: UserUpdateInput) {
    const { id } = this.ctx.user

    const { company } = this.ctx
    const user = await User.findOne(id)

    console.log('authkey', authKey)
    console.log('ctx company', company)

    if (!user) {
      return this.badRequest({ error: `User with username ${username} doesn\'t exist` })
    }

    if (type === UserType.EMPLOYER) {
      if (company.authKey !== authKey) {
        return this.badRequest({ error: 'Wrong password' })
      }
    }
    user.username = username
    user.type = type
    await user.save()

    return this.accepted(user)
  }



  @DELETE('/:id')
  public async delete() {
    User.delete(this.routeData.id)
      .then(this.accepted)
      .catch(this.badRequest)
  }
}
