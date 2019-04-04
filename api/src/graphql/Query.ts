import { queryType, stringArg } from 'yoga'
import { getRedirectUrl } from '../lib/googleAuth'

/*
type Query {
  hello(name: String!): String!
  user(name: String!): User!
}
*/
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
  },
})
