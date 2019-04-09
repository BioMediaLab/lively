exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('class_users')
    .del()
    .then(async () => {
      const classes = await knex('classes')
        .where({ name: 'Grocking and Kicking' })
        .select('id')
      const users = await knex('users')
        .where({ email: 'nicholas.dieffenbacherkrall@maine.edu' })
        .select('id')
      const classId = classes[0].id
      const userId = users[0].id
      // Inserts seed entries
      return knex('class_users').insert([
        {
          user: userId,
          class: classId,
          role: 'ADMIN',
        },
      ])
    })
}
