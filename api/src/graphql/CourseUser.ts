import { objectType } from 'yoga'
import { User } from './User'
import { CourseRole } from './enums'
import { Course } from './Course'

export const CourseUser = objectType({
  name: 'CourseUser',
  definition(t) {
    t.string('id')
    t.field('user', { type: User })
    t.field('role', { type: CourseRole })
    t.field('course', {
      type: Course,
      resolve: async (root, args, context) => {
        return context
          .knex('courses')
          .where({ id: root.course })
          .select('*')
      },
    })
  },
})
