import { objectType } from 'yoga'
import { User } from './User'
import { CourseRole } from './enums'
import { Course } from './Course'

export const CourseUser = objectType({
  name: 'CourseUser',
  definition(t) {
    t.string('id')
    t.field('user', {
      type: User,
      resolve: async (root, args, context) => {
        const result = await context
          .knex('courseUsers')
          .join('users', 'courseUsers.user', '=', 'users.id')
          .select('users')
        return result[0]
      },
    })
    t.field('role', { type: CourseRole })
    t.field('course', {
      type: Course,
      resolve: async (root, args, context) => {
        const result = await context
          .knex('courseUsers')
          .join('courses', 'courseUsers.course', '=', 'courses.id')
          .select('courses.*')
        return result[0]
      },
    })
  },
})
