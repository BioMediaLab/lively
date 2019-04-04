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
          firstName: 'Andy',
          lastName: 'Kay',
          email: 'andrew.kay@maine.edu',
          siteAdmin: true,
          createdAt: new Date(),
        },
        {
          id: 2,
          name: 'Nick Dieff',
          firstName: 'Nick',
          lastName: 'Dieff',
          email: 'nicholas.dieffenbacherkrall@maine.edu',
          siteAdmin: true,
          createdAt: new Date(),
        },
        {
          id: 3,
          name: 'Enoch Lin',
          firstName: 'Enoch',
          lastName: 'Lin',
          email: 'wei.lin@maine.edu',
          siteAdmin: true,
          createdAt: new Date(),
        },
      ])
    })
}