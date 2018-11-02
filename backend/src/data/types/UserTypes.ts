import { IsEnum, IsString, Length, Min, ValidateIf } from 'class-validator'

import { UserType } from '../enums/UserType'

export class UserInput {
  @Length(5, 20)
  public username: string

  @IsEnum(UserType)
  public type: UserType

  @ValidateIf(o => !!o)
  @IsString()
  public googleToken?: string | null

  public constructor({ username, type, googleToken }: UserInput) {
    this.username = username
    this.type = type
    this.googleToken = googleToken
  }
}
