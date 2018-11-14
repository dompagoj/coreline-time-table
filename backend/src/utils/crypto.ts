import { verify } from 'jsonwebtoken'
import { UserType } from '../data/enums/UserType'
import { config } from '../server/config'

export async function verifyToken(token: string): Promise<VerifyTokenRes | undefined> {
  return new Promise((resolve, reject) => {
    verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        console.log('ERROR while verifing')
        return resolve(undefined)
      }
      resolve(decoded)
    })
  }) as any
}

interface VerifyTokenRes {
  id: number
  email: string
  type: UserType
}
