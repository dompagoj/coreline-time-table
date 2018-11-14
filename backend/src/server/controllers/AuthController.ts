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
    let user = await User.findOne({
      where: {
        email,
      },
    })
    const company = await Company.findOne({
      where: { domain: hd },
    })
    if (!company) {
      return this.badRequest({ error: `No company with domain: ${hd}` })
    }
    if (!user) {
      user = await User.create({
        email,
        firstName,
        lastName,
        type: UserType.EMPLOYEE,
        googleToken,
        username: firstName,
        companyId: company.id,
        avatar: picture,
      }).save()
    }
    const { googleToken: token, ...data } = user
    return this.accepted({
      token: sign({ email, id: user.id, type: user.type }, config.jwtSecret),
      user: data,
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
