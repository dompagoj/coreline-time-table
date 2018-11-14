import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { UserType } from '../enums/UserType'
import { Company } from './Company'
import { Hour } from './Hour'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({ nullable: true })
  public username: string

  @Column({ nullable: true })
  public firstName: string

  @Column({ nullable: true })
  public lastName: string

  @Column({ nullable: true })
  public googleToken: string

  @Column({ unique: true })
  public email: string

  @Column({ enum: UserType, default: UserType.EMPLOYEE })
  public type: UserType

  @Column({ nullable: true })
  public avatar?: string

  @Column()
  public companyId: number

  @ManyToOne(type => Company, company => company.users, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  public company: Promise<Company>

  @OneToMany(type => Hour, hour => hour.user)
  public hours: Promise<Hour[]>
}
