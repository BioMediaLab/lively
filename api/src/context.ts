import { data, Data } from './data'
import { knex } from './db'

export interface Context {
  data: Data
  knex: any
}

export default () => ({
  data,
  knex,
})
