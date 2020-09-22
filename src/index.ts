import "reflect-metadata"

import { ApolloServer } from "apollo-server-express"
import Express from "express"
import { UserResolver } from "./graphql/resolvers/UserResolver"
import { buildSchema } from "type-graphql"
import { createConnection } from "typeorm"
import { TweetResolver } from "./graphql/resolvers/TweetResolver"

//main
const main = async () => {
  await createConnection()

  const schema = await buildSchema({
    resolvers: [UserResolver, TweetResolver],
  })

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  })
  const app = Express()

  apolloServer.applyMiddleware({ app })
  const port = 8000
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}/graphql`)
  })
}

main()
