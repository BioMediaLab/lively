import { objectType, intArg } from 'yoga'
import { CourseUser } from './CourseUser'

export const Course = objectType({
  name: 'Course',
  description: "represents one of lively's courses",
  definition(t) {
    t.string('id', { description: 'Course ID' })
    t.string('name')
    t.string('description')
    t.list.field('members', {
      type: CourseUser,
      args: {
        max: intArg(),
      },
      resolve: async (root, args, context, ast) => {
        const courseId = root.id
        const y = ast.fieldNodes
        console.log(y)
        return context
          .knex('courseUsers')
          .where({ course: courseId })
          .limit(args.max)
          .select('*')
      },
    })
  },
})