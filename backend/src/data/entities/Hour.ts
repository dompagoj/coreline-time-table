import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Project } from './Project'
import { User } from './User'

@Entity()
export class Hour extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public amount: number

  @Column({ type: 'text', nullable: true })
  public description?: string

  @Column()
  public userId: number

  @Column({ type: 'date' })
  public date: Date

  @Column({ nullable: true })
  public projectId?: number

  @ManyToOne(type => Project, project => project.hours, { onDelete: 'SET NULL', nullable: true })
  public project?: Project

  @ManyToOne(type => User, user => user.hours, { onDelete: 'CASCADE' })
  public user: User
}
