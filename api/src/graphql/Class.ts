import { objectType, intArg } from 'yoga'
import { ClassUser } from './ClassUser'

export const Class = objectType({
  name: 'Class',
  description: "represents one of lively's classes",
  definition(t) {
    t.string('id', { description: 'Class ID' })
    t.string('name')
    t.string('description')
    t.list.field('members', {
      type: ClassUser,
      args: {
        max: intArg(),
      },
      resolve: async (root, args, context) => {
        const classId = root.id
        return context
          .knex('class_users')
          .where({ class: classId })
          .limit(args.max)
          .select('*')
      },
    })
  },
})
