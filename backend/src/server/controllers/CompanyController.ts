import { Company } from '../../data/entities/Company'
import { CompanyInput } from '../../data/types/CompanyTypes'
import { Context } from '../../data/types/Context'
import { DELETE, GET, POST, PUT } from '../controller-decorators'
import { BaseController } from './BaseController'

export class CompanyController extends BaseController<Context> {
  public constructor(req, res, next) {
    super(req, res, next)
  }

  @GET('/')
  public async all() {
    const companies = await Company.find()

    this.accepted(companies)
  }

  @GET('/:id')
  public async one() {
    const { id } = this.routeData
    Company.findOneOrFail(id)
      .then(company => this.accepted(company))
      .catch(e => this.badRequest(`Company with an id ${id} doesn't exists`))
  }

  @POST('/')
  public async create({ name }: CompanyInput) {
    Company.create({
      name,
    })
      .save()
      .then(company => this.accepted(company))
      .catch(e => this.badRequest('Company already exists'))
  }

  @DELETE('/:id')
  public async delete() {
    const { id } = this.routeData
    Company.delete(id)
      .then(() => this.accepted('Delete successful'))
      .catch(e => this.badRequest())
  }

  @PUT('/:id')
  public async update({ name }: CompanyInput) {
    const { id } = this.routeData
    Company.update(id, {
      name,
    })
      .then(company => {
        this.accepted(company)
      })
      .catch(e => this.badRequest())
  }
}
