import { Request, Response } from 'express'
import { Context } from '../../data/types/Context'
import { verifyToken } from '../../utils/crypto'

export function verifyJWT() {
  return async (req: Request & { ctx: Context }, res: Response, next) => {
    const user = await verifyToken(req.headers.token as string)

    if (!user) {
      res.status(401).end()
    }

    req.ctx = {
      user,
    }
    next()
  }
}
