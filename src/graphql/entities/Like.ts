import { BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Entity, ManyToOne, RelationId } from "typeorm"
import { Field, ID, ObjectType } from "type-graphql"
import { User } from "./User"
import { Tweet } from "./Tweet"

@ObjectType()
@Entity()
export class Like extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  readonly id: number

  @Field(type => Tweet)
  @ManyToOne(type => Tweet)
  tweet: Tweet
  @RelationId((like: Like) => like.tweet)
  tweetId: number

  @Field(type => User)
  @ManyToOne(type => User)
  user: User
  @RelationId((like: Like) => like.user)
  userId: number

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date
}