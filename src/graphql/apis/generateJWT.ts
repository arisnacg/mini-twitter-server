import { sign, verify } from "jsonwebtoken"
import { User } from "../entities/User"

export function generateAccessToken(user: User) {
  return sign({ id: user.id, username: user.username }, "secret", {
    expiresIn: "30m",
  })
}

export function generateRefreshToken(user: User) {
  return sign({ id: user.id, username: user.username }, "secretRefresh")
}

export function verifyAceessToken(token: string) {
  return verify(token, "secret")
}

export function verifyRefreshToken(token: string) {
  return verify(token, "secretRefresh")
}
