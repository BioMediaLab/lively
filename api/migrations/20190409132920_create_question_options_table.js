exports.up = function(knex, Promise) {
  return knex.schema.createTable('question_options', t => {
    t.increments('id')
      .unsigned()
      .primary()
    t.bigInteger('question_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('questions')
      .notNull()
    t.string('text').notNull()
    t.boolean('is_correct').defaultTo(0)
    t.timestamps()
  })
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.raw("SET session_replication_role = 'replica';"),

    knex.schema.dropTable('question_options'),

    knex.raw("SET session_replication_role = 'origin';"),
  ])
}
