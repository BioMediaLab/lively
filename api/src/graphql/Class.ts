import { objectType, intArg, idArg, booleanArg } from 'yoga'
import { ClassMember } from './ClassMember'
import { ClassFile } from './ClassFile'
import { ClassUnit } from './ClassUnit'

export const Class = objectType({
  name: 'Class',
  description: "represents one of lively's classes",
  definition(t) {
    t.string('id', { description: 'Class ID' })
    t.string('name')
    t.string('description')
    t.field('myRole', {
      type: ClassMember,
      resolve: async (root, _, context) => {
        return context
          .knex('class_users')
          .where({ class_id: root.id })
          .andWhere({ user_id: context.user.id })
          .first()
      },
    })
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
          .orderBy('name')
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
          .orderBy('file_name')
          .limit(limit)
          .select('*')
      },
    })
    t.list.field('units', {
      type: ClassUnit,
      args: {
        deployed: booleanArg({ nullable: true }),
      },
      resolve: async (root, args, ctx) => {
        if (args.deployed) {
          return ctx
            .knex('class_units')
            .where({ class_id: root.id })
            .andWhere({ deployed: true })
        }
        return ctx
          .knex('class_units')
          .where({ class_id: root.id })
          .orderBy('order')
      },
    })
    t.field('unit', {
      type: ClassUnit,
      args: { unit_id: idArg() },
      resolve: async (root, args, ctx) => {
        return ctx
          .knex('class_units')
          .where({ id: args.unit_id })
          .first()
      },
    })
  },
})
