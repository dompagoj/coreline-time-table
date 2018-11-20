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

  @Column()
  public authKey: string

  @Column()
  public domain: string

  @OneToMany(type => User, user => user.company)
  public users: Promise<User[]>

  @OneToMany(type => Project, project => project.company)
  public projects: Promise<Project[]>

  @OneToMany(type => Poll, poll => poll.company)
  public EOFMVotes: Promise<Poll[]>
}
