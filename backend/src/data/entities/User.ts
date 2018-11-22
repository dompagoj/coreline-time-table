import { BaseEntity, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserType } from '../enums/UserType'
import { Company } from './Company'
import { Hour } from './Hour'
import { Vote } from './Vote'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({ nullable: true })
  public username: string

  @Column({ nullable: true })
  public firstName: string

  @Column({ nullable: true })
  public lastName: string

  @Column({ unique: true })
  public email: string

  @Column({ enum: UserType, default: UserType.EMPLOYEE })
  public type: UserType

  @Column({ nullable: true })
  public avatar?: string

  @Column()
  public companyId: number

  @ManyToOne(type => Company, company => company.users, { nullable: false, onDelete: 'CASCADE' })
  public company: Company

  @OneToMany(type => Hour, hour => hour.user)
  public hours: Hour[]

  @OneToOne(type => Vote, vote => vote.votedFor)
  public vote: Vote

  @OneToMany(type => Vote, vote => vote.voter)
  public votes: Vote[]
}
