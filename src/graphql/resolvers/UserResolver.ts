import {
  Resolver,
  Query,
  Arg,
  Int,
  Mutation,
  Ctx,
  UseMiddleware,
} from "type-graphql"
import { compare, hash, genSalt } from "bcryptjs"
import { User } from "../entities/User"
import { IsAuth } from "../middleware/IsAuth"
import { MyContext } from "../context/MyContext"
import { AuthResponse } from "./responses/AuthResponse"
import { RegisterInput } from "./inputs/RegisterInput"
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../apis/generateJWT"

@Resolver()
export class UserResolver {
  @Query((returns) => [User])
  users() {
    return User.find()
  }

  @Query((returns) => User, { nullable: true })
  user(@Arg("id", (type) => Int) id: number) {
    return User.findOne({ id: id })
  }

  @Query(() => User)
  @UseMiddleware(IsAuth)
  async me(@Ctx() { payload }: MyContext) {
    return User.findOne({ id: payload!.id })
  }

  @Mutation(() => AuthResponse)
  async register(@Arg("input") input: RegisterInput) {
    if (input.password !== input.confirmPassword) {
      throw new Error("Your password is not confirmed")
    }

    const salt = await genSalt(10)
    const hashPassword = await hash(input.password, salt)
    let user = new User()
    ;(user.username = input.username),
      (user.email = input.email),
      (user.password = hashPassword)
    const newUser = await user.save()
    const token = generateAccessToken(newUser)
    const refreshToken = generateRefreshToken(user)
    newUser.refreshToken = refreshToken
    await newUser.save()

    return {
      accessToken: token,
      refreshToken: refreshToken,
      user: newUser,
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(IsAuth)
  async logout(@Ctx() { payload }: MyContext) {
    const user = await User.findOne({ id: payload!.id })
    if (user) {
      user.refreshToken = ""
      user.save()
      return true
    } else {
      throw new Error("No user founded")
    }
  }

  @Mutation(() => String)
  async token(@Arg("refreshToken") refreshToken: string) {
    const user = await User.findOne({ refreshToken })
    if (user) {
      const payload = (await verifyRefreshToken(refreshToken)) as any
      if (payload.id == user.id) {
        const accessToken = generateAccessToken(user)
        return accessToken
      } else {
        throw new Error("User ID is different")
      }
    } else {
      throw new Error("User with refresh token not found")
    }
  }

  @Mutation(() => AuthResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string
  ) {
    const user = await User.findOne({ where: { username } })
    if (!user) {
      throw new Error("Could not find user")
    }
    const verify = await compare(password, user.password)
    if (!verify) {
      throw new Error("Bad password")
    }

    const token = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    user.refreshToken = refreshToken
    await user.save()

    return {
      user: user,
      refreshToken: refreshToken,
      accessToken: token,
    }
  }
}
