import { BaseEntity, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { PollType } from '../enums/PollType'
import { Company } from './Company'
import { Vote } from './Vote'

@Entity()
export class Poll extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public companyId: number

  @Column({ enum: PollType })
  public type: PollType

  @Column({ default: new Date() })
  public startDate: Date

  @Column()
  public endDate: Date

  @Column({ default: true })
  public active: boolean

  @ManyToOne(type => Company, company => company.EOFMVotes)
  public company: Company

  @OneToMany(type => Vote, vote => vote.poll)
  public votes: Vote[]
}
