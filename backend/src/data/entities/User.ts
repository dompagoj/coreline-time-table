import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { UserType } from '../enums/UserType'
import { Company } from './Company'
import { Hour } from './Hour'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public username: string

  @Column({ nullable: true })
  public googleToken: string

  @Column({ enum: UserType })
  public type: UserType

  @ManyToOne(type => Company, company => company.users, { lazy: true })
  public company: Promise<Company>

  @OneToMany(type => Hour, hour => hour.user)
  public hours: Hour[]
}
