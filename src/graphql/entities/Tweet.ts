import { BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, ManyToOne, RelationId, OneToMany } from "typeorm"
import { Field, ID, ObjectType } from "type-graphql"
import { User } from "./User"
import { Like } from "./Like"

@ObjectType()
@Entity()
export class Tweet extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  readonly id: number

  @Field()
  @Column()
  text: string

  @Field(type => User)
  @ManyToOne(type => User)
  author: User
  @RelationId((tweet: Tweet) => tweet.author)
  auhorId: number

  @Field(type => [Like])
  @OneToMany(type => Like, like => like.tweet)
  likes: Like

  @Field()
  likesCount: number

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date
}