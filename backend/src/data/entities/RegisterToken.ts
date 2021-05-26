import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Index, ManyToOne } from "typeorm";
import { Company } from "./Company";

@Entity()
export class RegisterToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Index({ unique: true })
  @Column()
  public token: string

  @Column()
  public companyId: number

  @Column()
  public expires: Date

  @ManyToOne(() => Company)
  public company: Company
}
