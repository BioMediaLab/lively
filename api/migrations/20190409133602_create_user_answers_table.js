exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_answers', t => {
    t.increments('id')
      .unsigned()
      .primary()
    t.bigInteger('quiz_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('quizzes')
      .notNull()
    t.bigInteger('question_option_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('question_options')
      .notNull()
    t.timestamps()
  })
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.raw("SET session_replication_role = 'replica';"),

    knex.schema.dropTable('user_answers'),

    knex.raw("SET session_replication_role = 'origin';"),
  ])
}
