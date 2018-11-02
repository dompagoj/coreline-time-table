import { Router } from 'express'
import { registerRoutes } from '../../utils/helper-functions'
import { CompanyController } from '../controllers/CompanyController'

export const companyRouter = Router()

registerRoutes(companyRouter, CompanyController)
