exports.up = function(knex, Promise) {
  return knex.schema.createTable('courses', t => {
    t.increments('id')
      .unsigned()
      .primary()
    t.string('name').notNull()
    t.string('description').nullable()
    t.timestamps(false, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('courses')
}
