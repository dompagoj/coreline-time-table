import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from './User'

@Entity()
export class Hour extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public amount: number

  @Column()
  public userId: number

  @Column({ type: 'date', default: new Date(), unique: true })
  public date: Date

  @ManyToOne(type => User, user => user.hours)
  @JoinColumn({ name: 'user_id' })
  public user: Promise<User>
}
