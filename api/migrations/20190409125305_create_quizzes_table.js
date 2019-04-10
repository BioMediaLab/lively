exports.up = function(knex, Promise) {
  return knex.schema.createTable('quizzes', t => {
    t.increments('id')
      .unsigned()
      .primary()
    t.bigInteger('class_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('classes')
      .notNull()
    t.string('title').notNull()
    t.timestamps()
  })
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.raw("SET session_replication_role = 'replica';"),

    knex.schema.dropTable('quizzes'),

    knex.raw("SET session_replication_role = 'origin';"),
  ])
}
