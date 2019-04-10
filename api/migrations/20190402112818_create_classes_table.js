exports.up = function(knex, Promise) {
  return knex.schema.createTable('classes', t => {
    t.increments('id')
      .unsigned()
      .primary()
    t.string('name').notNull()
    t.string('description').nullable()
    t.timestamps(false, true)
  })
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.raw("SET session_replication_role = 'replica';"),

    knex.schema.dropTable('classes'),

    knex.raw("SET session_replication_role = 'origin';"),
  ])
}
