exports.up = function(knex, Promise) {
  return knex.schema.createTable('uploads', t => {
    t.increments('id')
      .unsigned()
      .primary()
    t.string('url')
    t.string('bucket')
    t.bigInteger('uploaded_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('users')
      .notNull()
    t.timestamps(false, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('uploads')
}
