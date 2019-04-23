import { mutationType, stringArg, idArg, arg } from 'yoga'
import { Session } from './Session'
import { setCredentialsFromCode, getProfileData } from '../lib/googleAuth'
import { addSession, deleteSession } from '../lib/sessions'
import { Quiz } from './Quiz'
import { User } from './User'
import { FileUpload } from './inputs'
import { ClassFile } from './ClassFile'
import console = require('console')

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

    t.field('uploadClassFile', {
      type: ClassFile,
      args: {
        file: arg({ type: FileUpload, required: true }),
        class_id: idArg(),
        description: stringArg({ required: false }),
      },
      resolve: async (_, args, context) => {
        const { description, class_id } = args
        const { createReadStream, mimetype, filename } = await args.file.file
        const name = args.file.name ? args.file.name : filename
        const { url, key, bucket } = await context.objectStorage.uploadFile(
          createReadStream(),
          mimetype,
        )
        const inserts = await context
          .knex('class_files')
          .insert({
            url,
            bucket,
            mimetype,
            description,
            class_id,
            uploader_id: context.user.id,
            file_name: name,
            file_key: key,
          })
          .returning('*')
        return inserts[0]
      },
    })

    t.field('deleteClassFile', {
      type: ClassFile,
      args: {
        file_id: idArg({ required: true }),
      },
      resolve: async (root, args, context) => {
        const file = await context
          .knex('class_files')
          .where({ id: args.file_id })
          .select('*')
          .first()
        if (!file) {
          throw new Error(`File ${args.file_id} could not be found`)
        }
        const status = await context.objectStorage.deleteFile(file.file_key)
        if (!status) {
          throw new Error(
            `Failed to remove file with key ${
              file.file_key
            } from object storage.`,
          )
        }
        await context
          .knex('class_files')
          .where({ id: args.file_id })
          .del()
        return file
      },
    })

    t.field('updateClassFile', {
      type: ClassFile,
      args: {
        file_id: idArg(),
        name: stringArg({ required: false }),
        description: stringArg({ required: false }),
      },
      resolve: async (_, { file_id, ...args }, ctx) => {
        const updateParams: any = {}
        if (args.name) {
          updateParams.file_name = args.name
        }
        if (args.description) {
          updateParams.description = args.description
        }
        const updatedFiles = await ctx
          .knex('class_files')
          .where({ id: file_id })
          .update(updateParams)
          .returning('*')
        return updatedFiles[0]
      },
    })

    t.field('cloneClassFile', {
      type: ClassFile,
      args: {
        old_file: idArg(),
        new_class_id: idArg({ required: false }),
      },
      resolve: async (_, { old_file, new_class_id }, ctx) => {
        const oldFile = await ctx
          .knex('class_files')
          .where({ id: old_file })
          .first()
        const class_id = new_class_id ? new_class_id : oldFile.class_id

        const newFile = await ctx.objectStorage.cloneFile(oldFile.file_key)
        const inserts = await ctx
          .knex('class_files')
          .insert({
            url: newFile.url,
            bucket: newFile.bucket,
            mimetype: oldFile.mimetype,
            description: oldFile.description,
            class_id: class_id,
            uploader_id: ctx.user.id,
            file_name: oldFile.file_name,
            file_key: newFile.key,
          })
          .returning('*')
        return inserts[0]
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
        const { url } = await context.objectStorage.uploadFile(
          createReadStream(),
          mimetype,
        )
        console.log(url)
        context
          .knex('users')
          .where({ id: context.user.id })
          .update({ photo: url })
        return context
          .knex('users')
          .where({ id: context.user.id })
          .first()
      },
    })
  },
})
