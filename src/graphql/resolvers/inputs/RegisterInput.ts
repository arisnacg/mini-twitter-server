import { User } from "../../entities/User"
import { Field, InputType } from "type-graphql"
import { IsEmail, MinLength } from "class-validator"
import { EmailAlreadyUsed } from "./validations/EmailAlreadyUsed"
import { UsernameAlreadyUsed } from "./validations/UsernameAlreadyUsed"

@InputType({ description: "New recipe data" })
export class RegisterInput implements Partial<User> {
  @Field()
  @UsernameAlreadyUsed({ message: "Username already used" })
  username: string

  @Field()
  @IsEmail()
  @EmailAlreadyUsed({ message: "Email already used" })
  email: string

  @Field()
  @MinLength(6)
  password: string

  @Field()
  @MinLength(6)
  confirmPassword: string
}
