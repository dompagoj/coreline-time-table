import { IsString, Min, ValidateIf } from 'class-validator'
import { EntityID } from './random'

export class CompanyInput {
  @ValidateIf(o => !!o)
  @Min(0)
  public id?: EntityID = undefined

  @IsString()
  public name: string

  public constructor({ id, name }: CompanyInput) {
    this.id = id
    this.name = name
  }
}
