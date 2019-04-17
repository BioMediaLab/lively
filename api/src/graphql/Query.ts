import { queryType, idArg, arg } from 'yoga'
import { getRedirectUrl } from '../lib/googleAuth'
import { ClassMember } from './ClassMember'
import { Class } from './Class'
import { Quiz } from './Quiz'
import { ClassRole } from './enums'

export const Query = queryType({
  definition(t) {
    t.string('googleRedirect', {
      resolve: () => getRedirectUrl(),
    })

    t.field('class', {
      type: Class,
      args: {
        class_id: idArg(),
      },
      resolve: async (_, args, context) => {
        return context
          .knex('classes')
          .where({ id: args.class_id })
          .select('*')
          .first()
      },
    })

    t.field('myClassRole', {
      type: ClassMember,
      args: {
        class_id: idArg(),
      },
      resolve: async (_, { class_id }, context) => {
        return context
          .knex('class_users')
          .where({ user_id: context.user.id })
          .andWhere({ class_id })
          .first()
      },
    })

    t.list.field('users', {
      type: 'User',
      resolve: (root, args, ctx) => {
        return ctx.knex('users').select('*')
      },
    })

    t.list.field('myClasses', {
      type: ClassMember,
      args: {
        role: arg({
          type: ClassRole,
          required: false,
          description:
            'Return only classes where the user has a given role, such as "Admin"',
        }),
      },
      resolve: async (root, args, context) => {
        return context
          .knex('class_users')
          .where({ user_id: context.user.id })
          .andWhere(args.role ? { role: args.role } : {})
          .select('*')
      },
    })

    t.list.field('classQuizzes', {
      type: Quiz,
      args: {
        class_id: idArg(),
      },
      resolve: async (root, args, context) => {
        return context.knex('quizzes').where('class_id', args.class_id)
      },
    })
  },
})
