exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', t => {
    t.increments('id')
      .unsigned()
      .primary()
    t.string('name').notNull()
    t.string('email')
      .notNull()
      .unique()
    t.string('photo').nullable()
    t.dateTime('createdAt').notNull()
    t.dateTime('updatedAt').nullable()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
}
