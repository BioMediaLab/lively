exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          name: 'Andy Kay',
          email: 'andrew.kay@maine.edu',
          createdAt: new Date(),
        },
        {
          id: 2,
          name: 'Nick Dieff',
          email: 'nick.dieff@gmail.com',
          createdAt: new Date(),
        },
        {
          id: 3,
          name: 'Enoch Lin',
          email: 'wei.lin@maine.edu',
          createdAt: new Date(),
        },
      ])
    })
}
