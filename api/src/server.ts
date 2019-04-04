import { Server } from 'http'
import * as path from 'path'
import { ApolloServer, express, makeSchema, yogaEject } from 'yoga'
import * as cookieParser from 'cookie-parser'
import * as cors from 'cors'
import context from './context'
import * as types from './graphql'

export default yogaEject({
  async server() {
    const app = express()

    app.get('/healthz', function(req, res) {
      res.status(200).send('ok')
    })

    /* these are needed in order to intercept
    credentials from the front end requests*/
    app.use(
      cors({
        origin: true,
        credentials: true,
      }),
    )
    app.use(cookieParser())

    const schema = makeSchema({
      types,
      outputs: {
        schema: path.join(__dirname, './schema.graphql'),
        typegen: path.join(__dirname, '../.yoga/nexus.ts'),
      },
      typegenAutoConfig: {
        sources: [
          {
            source: path.join(__dirname, './context.ts'),
            alias: 'ctx',
          },
        ],
        contextType: 'ctx.Context',
      },
    })

    const apolloServer = new ApolloServer.ApolloServer({
      schema,
      context,
    })

    apolloServer.applyMiddleware({ app, path: '/', cors: false })
    return app
  },
  async startServer(express) {
    return new Promise<Server>((resolve, reject) => {
      const httpServer = express
        .listen({ port: 4000 }, () => {
          console.log(`🚀  Server ready at http://localhost:4000/`)
          resolve(httpServer)
        })
        .on('error', err => reject(err))
    })
  },
  async stopServer(httpServer) {
    return httpServer.close()
  },
})
