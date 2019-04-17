import { objectType, intArg } from 'yoga'
import { ClassMember } from './ClassMember'
import { ClassFile } from './ClassFile'

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
        max: intArg({ nullable: true }),
      },
      resolve: async (root, args, context) => {
        const limit = args.max ? args.max : 10
        const classId = root.id
        return context
          .knex('class_users')
          .where({ class_id: classId })
          .limit(limit)
          .select('*')
      },
    })
    t.list.field('files', {
      type: ClassFile,
      args: {
        max: intArg({ nullable: true }),
      },
      resolve: async (root, args, context) => {
        const limit = args.max ? args.max : 10
        return context
          .knex('class_files')
          .where({ class_id: root.id })
          .limit(limit)
          .select('*')
      },
    })
  },
})
