import { objectType } from 'yoga'
import { User } from './User'
import { Class } from './Class'
import { ClassUnit } from './ClassUnit'

export const ClassFile = objectType({
  name: 'ClassFile',
  definition(t) {
    t.id('id')

    t.string('url')

    t.string('mimetype')

    t.string('file_key')

    t.string('file_name')

    t.id('class_id')

    t.id('uploader_id')

    t.id('unit_id')

    t.int('order', { nullable: true })

    t.string('description', { nullable: true })

    t.field('creator', {
      type: User,
      resolve: async (root, _, context) => {
        return context
          .knex('class_files')
          .where({ id: root.id })
          .join('users', 'class_files.uploader_id', '=', 'users.id')
          .select('users.*')
          .first()
      },
    })

    t.field('class', {
      type: Class,
      resolve: async (root, _, context) => {
        // assuming that the upstream resolver will just return
        // the whole db object
        return context
          .knex('classes')
          .where({ id: root.class_id })
          .first()
      },
    })

    t.field('unit', {
      type: ClassUnit,
      resolve: async ({ unit_id }, _, ctx) =>
        ctx.knex('class_units').where({ id: unit_id }),
    })
  },
})
