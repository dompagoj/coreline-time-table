import { IsEnum, Length, Min, validate } from 'class-validator'

import { Company } from '../entities/Company'
import { UserType } from '../enums/UserType'

export class UserCreateInput {
  @Length(5, 20)
  private username: string

  @IsEnum(UserType)
  private type: UserType

  @Min(0)
  private companyId: number

  private googleToken?: string | null

  public constructor(
    username: string,
    type: UserType,
    companyId: number,
    googleToken?: string | null,
  ) {
    this.username = username
    this.type = type
    this.companyId = companyId
    this.googleToken = googleToken
  }

  public getFields(company) {
    return {
      username: this.username,
      type: this.type,
      company: Promise.resolve(company),
      googleToken: this.googleToken,
    }
  }
}
