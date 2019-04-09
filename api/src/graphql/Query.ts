import { queryType } from 'yoga'
import { getRedirectUrl } from '../lib/googleAuth'
import { ClassUser } from './ClassUser'

export const Query = queryType({
  definition(t) {
    t.string('googleRedirect', {
      resolve: () => getRedirectUrl(),
    })

    t.list.field('users', {
      type: 'User',
      resolve: (root, args, ctx) => {
        return ctx.knex('users').select('*')
      },
    })

    t.list.field('myClasses', {
      type: ClassUser,
      resolve: async (root, args, context) => {
        return context
          .knex('class_users')
          .where({ user: context.user.id })
          .select('*')
      },
    })
  },
})
