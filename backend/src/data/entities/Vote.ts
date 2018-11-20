import { BaseEntity, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Poll } from './Poll'
import { User } from './User'

@Entity()
export class Vote extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(type => Poll, poll => poll.votes)
  public poll: Promise<Poll>

  @ManyToOne(type => User, user => user.votes)
  public voter: Promise<User>

  @OneToOne(type => User, user => user.vote)
  @JoinColumn()
  public votedFor: Promise<User>
}
