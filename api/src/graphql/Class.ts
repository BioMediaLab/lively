import { objectType, intArg } from 'yoga'
import { ClassMember } from './ClassMember'

export const Class = objectType({
  name: 'Class',
  description: "represents one of lively's classes",
  definition(t) {
    t.string('id', { description: 'Class ID' })
    t.string('name')
    t.string('description')
    t.list.field('members', {
      type: ClassMember,
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
