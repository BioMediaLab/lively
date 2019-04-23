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

    t.string('class_id')

    t.string('uploader_id')

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
  },
})
