import { Request, Response } from 'express'
import { Company } from '../../data/entities/Company'
import { User } from '../../data/entities/User'
import { UserType } from '../../data/enums/UserType'
import { verifyToken } from '../../utils/crypto'

export async function verifyJWT(req: Request, res: Response, next) {
  const { authorization } = req.headers
  if (!authorization)
    return res
      .status(401)
      .json({ error: 'Invalid token' })
      .end()
  const [_, token] = authorization.split(' ')
  // spec is unclear wether bearer is case sensitive or not
  if (_.toLowerCase() === 'bearer' && !!token) {
    const user = await verifyToken(token.trim())
    if (!user)
      return next()

    res.locals.user = user
    return next()
  }

  return res
    .status(401)
    .json({ error: 'Invalid token' })
    .end()
}

export async function verifyCompany(req, res, next) {
  const { companyId } = req.params
  const { companyId: reqUserCompanyId, id: reqUserId } = res.locals.user
  if (reqUserCompanyId !== parseInt(companyId, 10)) {
    const reqUser = await User.findOneOrFail(reqUserId)
    if (reqUser.type !== UserType.ADMIN) {
      return res.status(401).end()
    }
  }

  const company = await Company.findOne(companyId)
  if (!company) {
    return res
      .status(400)
      .json({ error: 'Invalid company id' })
      .end()
  }
  res.locals.company = company

  next()
}

export async function verifyUser(req, res, next) {
  const { companyId, userId: userIdParams } = req.params
  const { id: userId } = res.locals.user

  if (userIdParams && parseInt(userIdParams, 10) !== userId) {
    const reqUser = await User.findOneOrFail(userId)
    if (reqUser.type !== UserType.EMPLOYER) {
      return res.status(401).end()
    }
  }

  const user = await User.findOne({
    where: {
      id: userIdParams,
      companyId,
    },
  })

  if (!user) {
    return res
      .status(400)
      .json({
        error: `No user with id ${userId} under company with id ${companyId} found`,
      })
      .end()
  }
  res.locals.user = user
  next()
}
