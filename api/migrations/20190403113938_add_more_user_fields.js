exports.up = function(knex, Promise) {
  return knex.schema.table('users', t => {
    t.boolean('siteAdmin').defaultTo(false)
    t.boolean('hasVisited').defaultTo(false)
    t.string('firstName').notNull()
    t.string('lastName').notNull()
    t.string('studentID')
    t.string('mi')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('users', t => {
    t.dropColumn('siteAdmin')
    t.dropColumn('hasVisited')
    t.dropColumn('firstName')
    t.dropColumn('lastName')
    t.dropColumn('studentID')
    t.dropColumn('mi')
  })
}
