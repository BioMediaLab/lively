import { yogaContext } from 'yoga'
import { data, Data } from './data'
import { knex } from './db'
import { getIdFromSession } from './lib/sessions'

export interface Context {
  data: Data
  knex: any
  user: {
    id?: string
    logged: boolean
  }
}

export default yogaContext(async httpContext => {
  const headers = httpContext.req.headers
  const user = {
    logged: headers.session ? true : false,
  }
  const id = await getIdFromSession(headers.session)
  if (id) {
    ;(user as any).id = id
  }
  return {
    data,
    knex,
    user,
  }
})
