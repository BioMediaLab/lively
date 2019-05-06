exports.up = function(knex) {
  return knex.schema.createTable('class_files', t => {
    t.increments('id')
      .unsigned()
      .primary()
    t.string('url').notNull()
    t.string('bucket')
    t.string('file_key')
    t.bigInteger('size')
    t.string('mimetype')
    t.string('file_name')
    t.string('description')
    t.bigInteger('uploader_id')
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
    t.timestamps(false, true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('class_files')
}
