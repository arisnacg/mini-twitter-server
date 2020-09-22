import { Request, Response } from "express"

export interface MyContext {
  req: Request
  res: Response
  payload?: { id: number; username: string }
}
