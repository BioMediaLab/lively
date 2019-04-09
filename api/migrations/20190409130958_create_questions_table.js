exports.up = function(knex, Promise) {
  return knex.schema.createTable('questions', t => {
    t.increments('id')
      .unsigned()
      .primary()
    t.string('title').notNull()
    t.bigInteger('quiz_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('quizzes')
      .notNull()
    t.timestamps()
  })
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.raw("SET session_replication_role = 'replica';"),

    knex.schema.dropTable('questions'),

    knex.raw("SET session_replication_role = 'origin';"),
  ])
}
