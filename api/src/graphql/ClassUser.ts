import { objectType } from 'yoga'
import { User } from './User'
import { CLassRole } from './enums'
import { Class } from './Class'

export const ClassUser = objectType({
  name: 'ClassUser',
  definition(t) {
    t.string('id')
    t.field('user', {
      type: User,
      resolve: async (root, args, context) => {
        const result = await context
          .knex('class')
          .join('users', 'class_users.user', '=', 'users.id')
          .select('users')
        return result[0]
      },
    })
    t.field('role', { type: ClassRole })
    t.field('class', {
      type: Class,
      resolve: async (root, args, context) => {
        const result = await context
          .knex('class_users')
          .join('classes', 'class_users.class', '=', 'classes.id')
          .select('classes.*')
        return result[0]
      },
    })
  },
})
