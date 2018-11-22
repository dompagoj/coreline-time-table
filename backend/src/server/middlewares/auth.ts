import { Request, Response } from 'express'
import { Company } from '../../data/entities/Company'
import { User } from '../../data/entities/User'
import { UserType } from '../../data/enums/UserType'
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

export async function verifyCompany(req, res, next) {
  const { companyId } = req.params
  const { companyId: reqUserCompanyId, id: reqUserId } = req.ctx.user

  if (reqUserCompanyId !== parseInt(companyId, 10)) {
    const reqUser = await User.findOne(reqUserId)
    if (reqUser.type !== UserType.ADMIN) {
      return res.status(401).end()
    }
  }

  const company = await Company.findOne(companyId)
  if (!company) {
    return res
      .json({ error: 'Invalid company id' })
      .status(400)
      .end()
  }
  res.locals.company = company

  next()
}
