import { IsEmail, IsEnum, IsString, Length, Min } from 'class-validator'

import { UserType } from '../enums/UserType'

export class UserInput {
  @Length(5, 20)
  public username: string | null

  @IsEnum(UserType)
  public type: UserType = UserType.EMPLOYEE

  @IsString()
  public googleToken?: string | null

  @IsEmail()
  public email: string

  @IsString()
  public firstName: string | null

  @IsString()
  public lastName: string | null

  @Min(0)
  public companyId?: number | null

  public constructor({ username, type, email, googleToken, firstName, lastName, companyId }: UserInput) {
    this.username = username
    this.type = type
    this.email = email
    this.googleToken = googleToken
    this.firstName = firstName
    this.lastName = lastName
    this.companyId = companyId
  }
}

export interface UserUpdateInput {
  username: string
  type: UserType
  authKey: string
  avatar: any
}
