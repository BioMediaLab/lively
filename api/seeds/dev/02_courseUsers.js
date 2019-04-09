exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('courseUsers')
    .del()
    .then(async () => {
      const courses = await knex('courses')
        .where({ name: 'Grocking and Kicking' })
        .select('id')
      const users = await knex('users')
        .where({ email: 'nicholas.dieffenbacherkrall@maine.edu' })
        .select('id')
      const courseId = courses[0].id
      const userId = users[0].id
      // Inserts seed entries
      return knex('courseUsers').insert([
        {
          user: userId,
          course: courseId,
          role: 'ADMIN',
        },
      ])
    })
}
