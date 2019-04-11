import { objectType } from 'yoga'

export const Quiz = objectType({
  name: 'Quiz',
  definition(t) {
    t.id('id')
    t.id('class_id')
    t.string('title')
  },
})
