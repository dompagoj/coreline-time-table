import { NextFunction, Request, Response } from 'express'
import { validateInput } from '../../utils/helper-functions'

export const validateBody = (Class: any) => async (req: Request, res: Response, next: NextFunction) => {
  const instance = new Class(...req.body)
  const { errors } = await validateInput(instance)
  if (errors) {
    res
      .status(400)
      .json(errors)
      .end()
  } else {
    next()
  }
}
