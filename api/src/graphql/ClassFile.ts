import { objectType } from 'yoga'
import { User } from './User'
import { Class } from './Class'

export const ClassFile = objectType({
  name: 'ClassFile',
  definition(t) {
    t.id('id')

    t.string('url')

    t.string('mimetype')

    t.string('file_key')

    t.string('file_name')

    t.string('description')

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
        return context
          .knex('class_files')
          .where({ id: root.id })
          .join('classes', 'class_files.class_id', '=', 'classes.id')
          .select('classes.*')
          .first()
      },
    })
  },
})
