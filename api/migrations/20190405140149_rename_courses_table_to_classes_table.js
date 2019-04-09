exports.up = function(knex, Promise) {
  return knex.schema.renameTable('courses', 'classes')
}

exports.down = function(knex, Promise) {
  return knex.schema.renameTable('classes', 'courses')
}
