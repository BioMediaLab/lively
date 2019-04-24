import { objectType } from 'yoga'
import { User } from './User'
import { Class } from './Class'
import { ClassFile } from './ClassFile'

export const ClassUnit = objectType({
  name: 'ClassUnit',
  definition(t) {
    t.id('id')
    t.string('name')
    t.string('description', { nullable: true })
    t.boolean('deployed')
    t.id('creator_id')
    t.id('class_id')
    t.string('last_modified', {
      resolve: async (root, args, ctx) => {
        const unitUpdateTime = await ctx
          .knex('class_units')
          .where({ id: root.id })
          .select('updated_at')
        const filesUpdateTime = await ctx
          .knex('class_files')
          .where({ unit_id: root.id })
          .max('updated_at')
        return `${unitUpdateTime} - ${filesUpdateTime}`
      },
    })
    t.field('creator', {
      type: User,
      resolve: async ({ creator_id }, _, ctx) => {
        return ctx
          .knex('users')
          .where({ id: creator_id })
          .first()
      },
    })
    t.field('class', {
      type: Class,
      resolve: async ({ class_id }, _, ctx) =>
        ctx
          .knex('classes')
          .where({ id: class_id })
          .first(),
    })
    t.list.field('files', {
      type: ClassFile,
      resolve: async ({ id, class_id }, _, ctx) =>
        ctx
          .knex('class_files')
          .where({ class_id })
          .andWhere({ unit_id: id })
          .orderBy('order'),
    })
  },
})
