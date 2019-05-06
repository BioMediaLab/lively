exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        {
          name: 'Andy Kay',
          firstName: 'Andy',
          lastName: 'Kay',
          email: 'andrew.kay@maine.edu',
          siteAdmin: true,
        },
        {
          name: 'Nick Dieff',
          firstName: 'Nick',
          lastName: 'Dieff',
          email: 'nicholas.dieffenbacherkrall@maine.edu',
          siteAdmin: true,
        },
        {
          name: 'Enoch Lin',
          firstName: 'Enoch',
          lastName: 'Lin',
          email: 'wei.lin@maine.edu',
          siteAdmin: true,
        },
        {
          name: 'Jeremiah User',
          firstName: 'Jeremiah',
          lastName: 'User',
          email: 'ju@maine.edu',
          photo_url:
            'https://en.meming.world/images/en/thumb/2/2b/Unsettled_Tom.jpg/300px-Unsettled_Tom.jpg',
        },
      ])
    })
}
