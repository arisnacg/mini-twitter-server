import {
  Resolver,
  Query,
  Arg,
  Int,
  FieldResolver,
  Root,
  UseMiddleware,
  Ctx,
} from "type-graphql"
import { Tweet } from "../entities/Tweet"
import { User } from "../entities/User"
import { Like } from "../entities/Like"
import { IsAuth } from "../middleware/IsAuth"
import { MyContext } from "../context/MyContext"

@Resolver((of) => Tweet)
export class TweetResolver {
  @Query(() => String)
  hello() {
    return "Hello World"
  }

  @Query((returns) => [Tweet])
  @UseMiddleware(IsAuth)
  tweets(@Ctx() { payload }: MyContext) {
    return Tweet.find()
  }

  @Query((returns) => Tweet, { nullable: true })
  @UseMiddleware(IsAuth)
  tweet(@Arg("id", (type) => Int) id: number, @Ctx() { payload }: MyContext) {
    return Tweet.findOne({ id: id })
  }

  @FieldResolver()
  async likes(@Root() tweet: Tweet) {
    return Like.find({
      where: {
        tweet: {
          id: tweet.id,
        },
      },
    })
  }

  @FieldResolver()
  async likesCount(@Root() tweet: Tweet) {
    return Like.count({
      where: {
        tweet: {
          id: tweet.id,
        },
      },
    })
  }

  @FieldResolver()
  async author(@Root() tweet: Tweet) {
    return await User.findOne({ id: tweet.auhorId })
  }
}
