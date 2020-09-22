import { User } from "../../entities/User"
import { Field, ObjectType } from "type-graphql"

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string

  @Field()
  refreshToken: string

  @Field((type) => User)
  user: User
}
