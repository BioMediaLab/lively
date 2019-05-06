import { objectType } from 'yoga'
import { User } from './User'
import { ClassRole } from './enums'
import { Class } from './Class'

export const ClassMember = objectType({
  name: 'ClassMember',
  definition(t) {
    t.string('id')
    t.field('user', {
      type: User,
      resolve: async (root, args, context) => {
        return context
          .knex('class_users')
          .where({ 'class_users.id': root.id })
          .join('users', 'class_users.user_id', '=', 'users.id')
          .select('users.*')
          .first()
      },
    })
    t.field('role', { type: ClassRole })
    t.field('class', {
      type: Class,
      resolve: async (root, args, context) => {
        return context
          .knex('class_users')
          .where({ 'class_users.user_id': root.id })
          .join('classes', 'class_users.class_id', '=', 'classes.id')
          .select('classes.*')
          .first()
      },
    })
  },
})
