exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('classes')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('classes').insert([
        { name: 'Lively 101', description: 'Welcome to Lively!' },
      ])
    })
}
