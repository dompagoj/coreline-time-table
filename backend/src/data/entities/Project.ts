import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectStatus } from '../enums/ProjectStatus';
import { Company } from './Company';
import { Hour } from './Hour';
import { User } from './User';

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

  @Column()
  public creatorId: number

  @OneToMany(() => Hour, hour => hour.project)
  public hours: Hour[]

  @ManyToOne(() => User, { nullable: false })
  public creator: User

  @ManyToOne(() => Company, company => company.projects)
  public company: Company
}
