import { enumType } from 'yoga'

export const CourseRole = enumType({
  name: 'CourseRole',
  description: "A user's role in a given course",
  members: ['STUDENT', 'ASSISTANT', 'AUDITOR', 'PROFESSOR', 'ADMIN'],
})
