import { IsDate, Max, Min, ValidateIf } from 'class-validator'
import { ID } from './random'

export class HourInput {
  @ValidateIf(o => !!o)
  @Min(0)
  public id?: ID

  @Min(0)
  @Max(12)
  public amount: number

  @IsDate()
  public date: Date
}
