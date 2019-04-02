require('dotenv').config()

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'lively',
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds/dev',
    },
  },
  production: {
    client: 'pg',
    connection: {
      database: 'lively',
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
}
