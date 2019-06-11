import { OAuth2Client } from 'google-auth-library'
import { sign } from 'jsonwebtoken'
import moment from 'moment'

import { Company } from '../../data/entities/Company'
import { User } from '../../data/entities/User'
import { UserType } from '../../data/enums/UserType'
import { config } from '../config'
import { POST } from '../controller-decorators'
import { BaseController } from './BaseController'
import { verifyPassword, hashPassword } from '../../utils/crypto';
import { RegisterToken } from '../../data/entities/RegisterToken';

export class AuthController extends BaseController {
  @POST('/company-login')
  public async companyLogin({ email, password }) {
    try {
      const user = await User.createQueryBuilder('u')
        .addSelect('u.password')
        .where('u.email = :email', { email })
        .getOne()
      if (!user)
        return this.badRequest('Invalid email or password')

      await verifyPassword(password, user.password, { validateAndThrow: true })
      delete user.password

      return this.accepted({
        token: sign({ email, id: user.id, type: user.type, companyId: user.companyId }, config.jwtSecret),
        user,
      })

    } catch(e) {
      console.error(e)

      return this.badRequest('Invalid email or password')
    }
  }

  @POST('/verify-token')
  public async verifyRegisterToken({ token }) {
    try {
      const registerToken = await RegisterToken.findOneOrFail({ where: { token } })
      if (moment(registerToken.expires).isBefore(moment())) {
        RegisterToken.delete(registerToken.id)

        return this.badRequest()
      }

      return this.accepted()
    } catch(e) {
      return this.unauthorized()
    }
  }

  @POST('/register')
  public async companyRegister({ user, token }) {
    if (!token)
      return this.unauthorized()

    const { username, firstName, lastName, email, password } = user
    try {
      const registerToken = await RegisterToken.findOneOrFail(token)
      if (moment(registerToken.expires).isBefore(moment())) {
        RegisterToken.delete(registerToken.id)
        
        return this.badRequest()
      }
      const company = await Company.findOneOrFail(registerToken.companyId)
      const user = await User.create({
        username,
        firstName,
        lastName,
        email,
        password,
        companyId: company.id,
      })

      RegisterToken.delete(registerToken.id)
      return this.accepted({
        token: sign({ email: user.email, id: user.id, type: user.type, companyId: user.companyId }, config.jwtSecret),
        user,
      })
    } catch(e) {
      return this.badRequest()
    }
  }

  @POST('/login')
  public async login({ googleToken }: { googleToken: string }) {
    const payload = await this.verify(googleToken)
    if (!payload) {
      return this.badRequest('Not valid google token')
    }

    const { email, given_name: firstName, family_name: lastName, hd, picture } = payload

    const company = await Company.findOne({
      where: { domain: hd },
    })
    if (!company) {
      return this.badRequest({ error: `No company with domain: ${hd}` })
    }

    let user = await User.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      user = await User.create({
        email,
        firstName,
        lastName,
        type: UserType.EMPLOYEE,
        username: firstName,
        companyId: company.id,
        avatar: picture,
      }).save()
    } else {
      user.firstName = firstName
      user.lastName = lastName

      await user.save()
    }

    return this.accepted({
      token: sign({ email, id: user.id, type: user.type, companyId: company.id }, config.jwtSecret),
      user,
      authKey: user.type === UserType.EMPLOYER ? company.authKey : '',
    })
  }

  private async verify(token: string) {
    const client = new OAuth2Client(config.googleClientId)
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.googleClientId,
    })
    if (!ticket) {
      return null
    }

    return ticket.getPayload()
  }
}
