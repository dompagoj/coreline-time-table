import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Company } from './Company'
import { Vote } from './Vote'

@Entity()
export class Poll extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public companyId: number

  @ManyToOne(type => Company, company => company.EOFMVotes, { onDelete: 'CASCADE' })
  public company: Promise<Company>

  @OneToMany(type => Vote, vote => vote.poll)
  public votes: Promise<Vote[]>
}
