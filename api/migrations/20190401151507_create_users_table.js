exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', t => {
    t.increments('id')
      .unsigned()
      .primary()
    t.string('name').notNull()
    t.string('firstName').notNull()
    t.string('lastName').notNull()
    t.string('email')
      .notNull()
      .unique()
    t.string('photo').nullable()
    t.boolean('siteAdmin').defaultTo(false)
    t.boolean('hasVisited').defaultTo(false)
    t.string('studentID')
    t.timestamps(false, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
}
