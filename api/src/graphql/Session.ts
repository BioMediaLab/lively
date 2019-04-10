import { objectType } from 'yoga'

export const Session = objectType({
  name: 'Session',
  definition(t) {
    t.id('id', { description: "current user's id" })
    t.string('session', {
      nullable: true,
      description: "current user's session token",
    })
    t.string('sessionInfo', {
      nullable: true,
      description:
        'A string describing the context (browser, ip) of the session. So the user can verify it.',
    })
  },
})
