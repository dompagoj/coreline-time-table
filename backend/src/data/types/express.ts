import { NextFunction, Request, Response } from 'express'

export type ExpressFunction<T> = (req: Request, res: Response, next: NextFunction) => T
