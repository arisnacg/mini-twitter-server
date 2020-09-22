import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from "typeorm"
import { Field, ID, ObjectType } from "type-graphql"

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  readonly id: number

  @Field()
  @Column()
  username: string

  @Field()
  @Column()
  email: string

  @Column()
  password: string

  @Column({ nullable: true })
  refreshToken: string

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date
}
