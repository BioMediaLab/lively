import { yogaContext } from 'yoga'
import { data, Data } from './data'
import { knex } from './db'
import * as Knex from 'knex/types/knex'
import { getIdFromSession } from './lib/sessions'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'

export interface Context {
  express: ExpressContext
  data: Data
  knex: Knex
  user: {
    id: string
    logged: boolean
  }
}

export default yogaContext(async httpContext => {
  const cookies = httpContext.req.cookies
  const user = {
    logged: cookies.session ? true : false,
    id: '',
  }
  const id = await getIdFromSession(cookies.session)
  if (id) {
    ;(user as any).id = id
  }
  return {
    data,
    knex,
    user,
    express: httpContext,
  }
})
