import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Poll } from './Poll'
import { Project } from './Project'
import { User } from './User'

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({
    unique: true,
  })
  public name: string

  @Column({ select: false })
  public authKey: string

  @Column()
  public domain: string

  @OneToMany(() => User, user => user.company)
  public users: User[]

  @OneToMany(() => Project, project => project.company)
  public projects: Project[]

  @OneToMany(() => Poll, poll => poll.company, { onDelete: 'CASCADE' })
  public polls: Poll[]
}
