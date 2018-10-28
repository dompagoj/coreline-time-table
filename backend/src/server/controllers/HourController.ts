import { Request, Response } from 'express'

import { Route } from '../../data/types/routing'
import { BaseController } from './BaseController'
import { GET } from '../controller-decorators';

export class HourController extends BaseController {
  public static routes: Route[] = []

  public constructor(req: Request, res: Response) {
    super(req, res)
  }

  @GET('/users/:id/hours')
  public async all() {
    
  }
}
