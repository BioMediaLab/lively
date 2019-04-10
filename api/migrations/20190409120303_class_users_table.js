exports.up = function(knex, Promise) {
  return knex.schema.createTable('class_users', t => {
    t.increments('id')
      .unsigned()
      .primary()
    t.enu('role', ['STUDENT', 'ASSISTANT', 'AUDITOR', 'PROFESSOR', 'ADMIN'])
    t.bigInteger('user_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('users')
      .notNull()
    t.bigInteger('class_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('classes')
      .notNull()
    t.timestamps()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('classes')
}
