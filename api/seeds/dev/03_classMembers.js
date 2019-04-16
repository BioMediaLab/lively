exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('class_users')
    .del()
    .then(async () => {
      const classes = await knex('classes')
        .where({ name: 'Lively 101' })
        .select('id')
      const nick = await knex('users')
        .where({ email: 'nicholas.dieffenbacherkrall@maine.edu' })
        .select('id')
      const andy = await knex('users')
        .where({ email: 'andrew.kay@maine.edu' })
        .select('id')
      const enoch = await knex('users')
        .where({ email: 'wei.lin@maine.edu' })
        .select('id')
      const classId = classes[0].id
      // Inserts seed entries
      return knex('class_users').insert([
        {
          user_id: nick[0],
          class_id: classId,
          role: 'ADMIN',
        },
        {
          user_id: andy[0],
          class_id: classId,
          role: 'ADMIN',
        },
        {
          user_id: enoch[0],
          class_id: classId,
          role: 'ADMIN',
        },
      ])
    })
}
