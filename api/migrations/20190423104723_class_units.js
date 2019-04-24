exports.up = function(knex) {
  return knex.schema.createTable('class_units', t => {
    t.increments('id')
      .unsigned()
      .primary()
    t.string('name').notNull()
    t.string('description')
    t.boolean('deployed').defaultTo(true)
    t.bigInteger('class_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('classes')
      .notNull()
    t.bigInteger('creator_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('users')
      .notNull()
    t.timestamps(false, true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('class_units')
}
