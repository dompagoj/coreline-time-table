import { verify } from 'jsonwebtoken'
import { UserType } from '../data/enums/UserType'
import { config } from '../server/config'
import { hash, compare } from 'bcrypt';

export async function verifyToken(token: string): Promise<VerifyTokenRes | undefined> {
  return new Promise(resolve => {
    verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        return resolve(undefined)
      }

      return resolve(decoded)
    })
  }) as any
}

export async function hashPassword(password: string) {
  const saltRounds = 10

  return new Promise<string>((resolve, reject) => {
    hash(password, saltRounds, (err, hash) => {
      if (err)
        return reject(err)

      return resolve(hash)
    })
  })
}

export async function verifyPassword(password: string, hashedPassword: string, options?: VerifyPasswordOptions) {
  return new Promise<boolean>((resolve, reject) => {
    compare(password, hashedPassword, (err, res) => {
      if (err)
        return reject(err)

      if (options && options.validateAndThrow) {
        if (res)
          return resolve(res)
        return reject(res)
      }

      return resolve(res)
    })
  })
}

interface VerifyTokenRes {
  id: number
  email: string
  type: UserType
}

interface VerifyPasswordOptions {
  validateAndThrow: boolean
}
