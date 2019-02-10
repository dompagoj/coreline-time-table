import { BaseEntity, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Poll } from './Poll'
import { User } from './User'

@Entity()
export class Vote extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(() => Poll, poll => poll.votes, { onDelete: 'CASCADE' })
  public poll: Poll

  @ManyToOne(() => User, user => user.votes)
  public voter: User

  @OneToOne(() => User, user => user.vote)
  @JoinColumn()
  public votedFor: User
}
