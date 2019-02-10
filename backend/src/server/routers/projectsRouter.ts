import { Router } from 'express'
import { registerRoutes } from '../../utils/helper-functions'
import { ProjectController } from '../controllers/ProjectController'
import { verifyCompany } from '../middlewares/auth'

export const projectsRouter = Router({ mergeParams: true })

projectsRouter.use('/', verifyCompany)

registerRoutes(projectsRouter, ProjectController)
