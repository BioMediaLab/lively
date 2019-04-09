exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('courses')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('courses').insert([
        { name: 'Grocking and Kicking', description: 'This is a test course' },
        {
          name: 'Bio 100',
          description: 'Bio 100: where you learn about biology',
        },
      ])
    })
}
