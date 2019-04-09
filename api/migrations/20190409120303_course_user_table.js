exports.up = function(knex, Promise) {
  return knex.schema.createTable('courseUsers', t => {
    t.increments('id')
      .unsigned()
      .primary()
    t.enu('role', ['STUDENT', 'ASSISTANT', 'AUDITOR', 'PROFESSOR', 'ADMIN'])
    t.integer('user')
      .unsigned()
      .notNullable()
    t.integer('course')
      .unsigned()
      .notNullable()
    t.timestamps()

    t.foreign('user')
      .references('id')
      .inTable('users')
    t.foreign('course')
      .references('id')
      .inTable('courses')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('courseUsers')
}
