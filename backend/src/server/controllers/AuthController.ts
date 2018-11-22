import { OAuth2Client } from 'google-auth-library'
import { sign } from 'jsonwebtoken'

// tslint:disable-next-line:no-submodule-imports
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket'
import { Company } from '../../data/entities/Company'
import { User } from '../../data/entities/User'
import { UserType } from '../../data/enums/UserType'
import { config } from '../config'
import { POST } from '../controller-decorators'
import { BaseController } from './BaseController'

export class AuthController extends BaseController {
  @POST('/login')
  public async login({ googleToken }: { googleToken: string }) {
    let payload: TokenPayload | null = null
    try {
      payload = await this.verify(googleToken)
    } catch (e) {
      return this.badRequest({ error: 'Not valid google token' })
    }
    const { email, given_name: firstName, family_name: lastName, hd, picture } = payload
    if (hd !== 'coreline.agency') {
      return this.badRequest({ error: 'Only coreline.agency domain is allowed' })
    }

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
      user.avatar = picture

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
    return ticket.getPayload()
  }
}
