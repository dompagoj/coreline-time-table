import { Request, Response } from 'express'
import { User } from '../../data/entities/User';

export async function getMe(req: Request, res: Response) {
  const { user: userFromToken } = res.locals

  try {
    const user = await User.findOneOrFail(userFromToken.id)

    res.status(200).json(user).end()
  } catch(e) {
    res.status(400).json({ error: 'Invalid token' })
  }
}