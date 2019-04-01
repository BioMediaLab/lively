const Knex = require('knex')
const knexConfig = require('../knexfile')
import { Model } from 'objection'

export const knex = Knex(
  process.env.NODE_ENV === 'production'
    ? knexConfig.production
    : knexConfig.development,
)

Model.knex(knex)
