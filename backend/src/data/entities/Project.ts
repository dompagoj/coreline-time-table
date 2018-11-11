import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Company } from './Company'

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public name: string

  @Column()
  public hours: number

  @Column()
  public companyId: number

  @ManyToOne(type => Company, company => company.projects)
  @JoinColumn({ name: 'company_id' })
  public company: Company
}
