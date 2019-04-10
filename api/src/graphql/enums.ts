import { enumType } from 'yoga'

export const ClassRole = enumType({
  name: 'ClassRole',
  description: "A user's role in a given class",
  members: ['STUDENT', 'ASSISTANT', 'AUDITOR', 'PROFESSOR', 'ADMIN'],
})
