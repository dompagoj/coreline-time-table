import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ProjectStatus } from '../enums/ProjectStatus'
import { Company } from './Company'
import { Hour } from './Hour'

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public name: string

  @Column({ nullable: true })
  public avatar: string

  @Column()
  public companyId: number

  @Column({ enum: ProjectStatus })
  public status: ProjectStatus

  @OneToMany(type => Hour, hour => hour.project)
  public hours: Hour[]

  @ManyToOne(type => Company, company => company.projects)
  public company: Company
}
