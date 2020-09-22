import { MiddlewareFn } from "type-graphql"
import { MyContext } from "../context/MyContext"
import { verifyAceessToken } from "../apis/generateJWT"
import { User } from "../entities/User"

export const IsAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authorization = context.req.headers["authorization"]
  console.log("hello")
  if (!authorization) {
    throw new Error("Not authenticated")
  }

  try {
    const token = authorization.split(" ")[1]
    const payload = (await verifyAceessToken(token)) as any
    const user = await User.findOne({ id: payload.id })
    if (user?.refreshToken === "") {
      throw new Error("Not authenticated")
    }
    context.payload = payload
  } catch (err) {
    throw new Error("Not authenticated")
  }
  return next()
}
