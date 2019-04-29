import { objectType } from 'yoga'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id')
    t.string('name')
    t.string('email')
    t.string('photo_key', { nullable: true })
    t.string('photo_url', { nullable: true })
    t.string('firstName')
    t.string('lastName')
    t.boolean('siteAdmin')
    t.boolean('hasVisited')
  },
})
