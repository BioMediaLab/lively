import { queryType } from 'yoga'
import { getRedirectUrl } from '../lib/googleAuth'
import { CourseUser } from './CourseUser'

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

    t.list.field('myCourses', {
      type: CourseUser,
      resolve: async (root, args, context) => {
        return context
          .knex('courseUsers')
          .where({ user: context.user.id })
          .select('*')
      },
    })
  },
})
