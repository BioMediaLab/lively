import { yogaContext } from 'yoga'
import { data, Data } from './data'
import { knex } from './db'
import * as Knex from 'knex/types/knex'
import { getIdFromSession } from './lib/sessions'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { ObjectStorage } from './lib/fileStorage'

const objectStorage = new ObjectStorage()

export interface Context {
  express: ExpressContext
  data: Data
  knex: Knex
  objectStorage: ObjectStorage
  user: {
    id: string
    logged: boolean
  }
}

export default yogaContext(async httpContext => {
  const cookies = httpContext.req.cookies
  let session: any = false
  if (cookies.session) {
    session = cookies.session
  } else if (httpContext.req.headers.session) {
    session = httpContext.req.headers.session
  }
  const user = {
    logged: session ? true : false,
    id: '',
  }
  if (session) {
    const id = await getIdFromSession(session)
    if (id) {
      ;(user as any).id = id
    } else if (cookies.session) {
      throw new Error('invalid ID!')
    }
  }
  return {
    data,
    knex,
    user,
    objectStorage,
    express: httpContext,
  }
})
