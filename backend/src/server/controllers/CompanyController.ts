import moment from 'moment'
import { Company } from '../../data/entities/Company'
import { CompanyInput } from '../../data/types/CompanyTypes'
import { Context } from '../../data/types/Context'
import { DELETE, GET, POST, PUT } from '../controller-decorators'
import { BaseController } from './BaseController'
import { RegisterToken } from '../../data/entities/RegisterToken';
import { createRegisterToken } from '../../utils/utils';

export class CompanyController extends BaseController<Context, { id: string }> {
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
      .catch(() => this.badRequest(`Company with an id ${id} doesn't exists`))
  }

  @POST('/')
  public async create({ name }: CompanyInput) {
    Company.create({
      name,
    })
      .save()
      .then(company => this.accepted(company))
      .catch(() => this.badRequest('Company already exists'))
  }

  @DELETE('/:id')
  public async delete() {
    const { id } = this.routeData
    Company.delete(id)
      .then(() => this.accepted('Delete successful'))
      .catch(() => this.badRequest())
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
      .catch(() => this.badRequest())
  }
  @POST('/:id/verify-key')
  private async verifyCompanyAuthKey({ authKey }) {
    const { id } = this.routeData
    const company = await Company.findOne({ 
      where: { id },
      select: ['authKey']
    })

    if (!company) {
      return this.badRequest('No company found')
    }

    if (company.authKey !== authKey) {
      return this.badRequest({ error: 'Wrong password' })
    }

    return this.accepted()
  }
}
