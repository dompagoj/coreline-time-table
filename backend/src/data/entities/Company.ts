import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({
    unique: true,
  })
  public name: string

  @OneToMany(type => User, user => user.company)
  public users: Promise<User[]>
}
