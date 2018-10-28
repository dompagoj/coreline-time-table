import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'

@Entity()
export class Hour extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public amount: number

  @Column({ type: 'date', default: new Date() })
  public date: Date

  @ManyToOne(type => User, user => user.hours)
  public user: User
}
