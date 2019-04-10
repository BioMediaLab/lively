import { queryType, idArg } from 'yoga'
import { getRedirectUrl } from '../lib/googleAuth'
import { ClassMember } from './ClassMember'
import { Class } from './Class'

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
      resolve: async (root, args, context) => {
        const result = await context
          .knex('classes')
          .where({ id: args.class_id })
          .select('*')
        return result[0]
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
      resolve: async (root, args, context) => {
        return context
          .knex('class_users')
          .where({ user: context.user.id })
          .select('*')
      },
    })
  },
})
