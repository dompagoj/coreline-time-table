import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Company } from './Company'

@Entity()
export class EOFMVote extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public companyId: number

  @ManyToOne(type => Company, company => company.EOFMVotes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  public company: Promise<Company>
}
