import { Request, Response } from 'express'
import { Context } from '../../data/types/Context'
import { verifyToken } from '../../utils/crypto'

export function verifyJWT() {
  return async (req: Request & { ctx: Context }, res: Response, next) => {
    if (!req.headers.token) {
      return res.status(401).end()
    }
    const user = await verifyToken(req.headers.token as string)

    if (!user) {
      return res.status(401).end()
    }

    req.ctx = {
      user,
    }
    next()
  }
}
