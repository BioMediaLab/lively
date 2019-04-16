import { mutationType, stringArg, idArg, arg } from 'yoga'
import { Session } from './Session'
import { setCredentialsFromCode, getProfileData } from '../lib/googleAuth'
import { addSession, deleteSession } from '../lib/sessions'
import { Quiz } from './Quiz'
import { User } from './User'
import { FileUpload } from './inputs'

export const Mutation = mutationType({
  definition(t) {
    t.field('loginGoogle', {
      type: Session,
      args: {
        code: stringArg(),
        sessionInfo: stringArg({ nullable: true }),
      },
      resolve: async (_, { code }, context) => {
        // this function is async, but returns nothing
        // we need to make sure it is complete before proceeding
        await setCredentialsFromCode(code)
        const data = await getProfileData()

        const ids = await context
          .knex('users')
          .where({ email: data.email })
          .select('id')
        let uid: string
        if (ids.length !== 1) {
          // we must create a new user
          const newUsers = await context
            .knex('users')
            .insert({
              email: data.email,
              firstName: data.given_name,
              lastName: data.family_name,
              name: data.name,
              photo: data.picture,
            })
            .returning('id')
          uid = newUsers[0]
        } else {
          // we already have the user
          uid = ids[0].id
        }

        const session = await addSession(uid, '')
        return {
          session,
          id: uid,
        }
      },
    })
    t.field('logout', {
      type: Session,
      resolve: async (_, __, context) => {
        const session = context.express.req.cookies.session
        await deleteSession(session)
        return {
          id: context.user.id,
        }
      },
    })

    t.field('createQuiz', {
      type: Quiz,
      args: {
        class_id: idArg(),
        title: stringArg(),
      },
      resolve: async (root, { class_id, title }, context) => {
        const [quiz] = await context
          .knex('quizzes')
          .insert({
            class_id,
            title,
          })
          .returning('*')

        return quiz
      },
    })

    t.field('updateProfilePic', {
      type: User,
      args: {
        pic: arg({ type: FileUpload, required: true }),
      },
      resolve: async (root, args, context) => {
        console.log(args)
        const { createReadStream, mimetype, filename } = await args.pic.file
        console.log(`The filename is ${filename} and the type is ${mimetype}`)
        const url = await context.objectStorage.uploadFile(
          createReadStream(),
          mimetype,
        )
        console.log(url)
        return context
          .knex('users')
          .where({ id: context.user.id })
          .first()
      },
    })
  },
})
