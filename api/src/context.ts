import { data, Data } from './data'
import { knex } from './db'
import console = require('console')
import { yogaContext } from 'yoga'

export interface Context {
  data: Data
  knex: any
  user: {
    id?: string
    logged: boolean
  }
}

export default yogaContext(httpContext => {
  const headers = httpContext.req.headers
  const user = {
    logged: headers.session ? true : false,
    id: '123',
  }
  console.log('hello!')
  return {
    data,
    knex,
    user,
  }
})
