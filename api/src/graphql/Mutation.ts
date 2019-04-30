import { mutationType, stringArg, idArg, arg, booleanArg, intArg } from 'yoga'
import { Session } from './Session'
import { setCredentialsFromCode, getProfileData } from '../lib/googleAuth'
import { addSession, deleteSession } from '../lib/sessions'
import { Quiz } from './Quiz'
import { User } from './User'
import { FileUpload } from './inputs'
import { ClassFile } from './ClassFile'
import { ClassUnit } from './ClassUnit'
import { knex } from '../db'
import console = require('console')
import { Value } from 'objection'

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
              photo_url: data.picture,
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

    t.field('updateAdmin', {
      type: User,
      args: {
        user_id: idArg({ nullable: true }),
        setAdmin: booleanArg(),
      },
      resolve: async (_, args, context) => {
        if (!args.user_id && args.setAdmin) {
          throw new Error('cannot change a different users admin priveleges')
        }
        let uid = args.user_id ? args.user_id : context.user.id
        const updatedUser = await context
          .knex('users')
          .where({ id: uid })
          .update({ siteAdmin: args.setAdmin })
          .returning('*')
        return updatedUser[0]
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
        unit_id: idArg(),
        description: stringArg({ required: false }),
        order: intArg({ nullable: true }),
      },
      resolve: async (_, args, context) => {
        const { description, class_id, unit_id, order } = args
        const { createReadStream, mimetype, filename } = await args.file.file
        const name = args.file.name ? args.file.name : filename
        const { url, key, bucket } = await context.objectStorage.uploadFile(
          context.objectStorage.getPublicBucket(),
          createReadStream(),
          mimetype,
        )
        // here we must determine the proper order if none is given
        const { max } = await knex('class_files')
          .where({ unit_id: args.unit_id })
          .max('order')
          .first()

        const inserts = await context
          .knex('class_files')
          .insert({
            url,
            bucket,
            mimetype,
            description,
            class_id,
            unit_id,
            order: order ? order : max ? max + 1 : 0,
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
        const status = await context.objectStorage.deleteFile(
          context.objectStorage.getPublicBucket(),
          file.file_key,
        )
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
        order: intArg({ required: false }),
        unit_id: idArg({ required: false }),
      },
      resolve: async (_, { file_id, ...args }, ctx) => {
        const oldFile = await ctx
          .knex('class_files')
          .where({ id: file_id })
          .first()

        if ('unit_id' in args) {
          if (args.unit_id != oldFile.unit_id) {
            const { count } = await ctx
              .knex('class_files')
              .where({ unit_id: args.unit_id })
              .count('id')
              .first()
            await ctx
              .knex('class_files')
              .where({ id: file_id })
              .update({
                unit_id: args.unit_id,
                order: count,
              })
            oldFile.order = count
            oldFile.unit_id = args.unit_id
          }
        }

        if ('order' in args && !args.order == oldFile.order) {
          const delta = oldFile.order > args.order ? 1 : -1
          const range = [oldFile.order, args.order].sort()
          await ctx
            .knex('class_files')
            .where({ unit_id: oldFile.unit_id })
            .andWhereBetween('order', range as any)
            .andWhereNot({ id: file_id })
            .increment('order', delta)

          await ctx
            .knex('class_files')
            .where({ id: file_id })
            .update({
              order: args.order,
            })

          oldFile.order = args.order
        }

        const updateParams: any = {}
        if (args.name) {
          updateParams.file_name = args.name
          oldFile.file_name = args.name
        }
        if (args.description) {
          updateParams.description = args.description
          oldFile.description = args.description
        }
        if (Object.keys(updateParams).length > 0) {
          await ctx
            .knex('class_files')
            .where({ id: file_id })
            .update(updateParams)
        }

        return oldFile
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

        const bucket = ctx.objectStorage.getPublicBucket()
        const newFile = await ctx.objectStorage.cloneFile(
          oldFile.file_key,
          bucket,
          bucket,
        )
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
        const { createReadStream, mimetype, filename } = await args.pic.file
        const { url, key } = await context.objectStorage.uploadFile(
          context.objectStorage.getPublicBucket(),
          createReadStream(),
          mimetype,
        )

        context
          .knex('users')
          .whereNotNull('photo_key')
          .andWhere({ id: context.user.id })
          .first()
          .then(async row => {
            await context.objectStorage.deleteFile(
              context.objectStorage.getPublicBucket(),
              row.photo_key,
            )
          })

        const newPic = await context
          .knex('users')
          .where({ id: context.user.id })
          .update({ photo_key: key, photo_url: url })
          .returning('*')
        return newPic[0]
      },
    })

    t.field('createClassUnit', {
      type: ClassUnit,
      args: {
        name: stringArg(),
        description: stringArg({ nullable: true }),
        class_id: idArg(),
        auto_deploy: booleanArg({ nullable: true }),
      },
      resolve: async (_, args, ctx) => {
        const deployed = args.auto_deploy ? args.auto_deploy : false
        const { max } = await ctx
          .knex('class_units')
          .where({ class_id: args.class_id })
          .max('order')
          .first()
        console.log(max)
        const res = await ctx
          .knex('class_units')
          .insert({
            name: args.name,
            description: args.description,
            class_id: args.class_id,
            creator_id: ctx.user.id,
            order: max ? max + 1 : 0,
            deployed,
          })
          .returning('*')
        return res[0]
      },
    })

    t.field('updateClassUnit', {
      type: ClassUnit,
      args: {
        unit_id: idArg(),
        name: stringArg({ nullable: true }),
        description: stringArg({ nullable: true }),
        add_files: idArg({ nullable: true, list: true }),
        deploy: booleanArg({ nullable: true }),
        order: intArg({ nullable: true }),
      },
      resolve: async (_, args, ctx) => {
        let updatedUnit: any = null

        console.log(args)
        let oldOrder
        if (
          'name' in args ||
          'description' in args ||
          'deploy' in args ||
          'order' in args
        ) {
          const updateBody: any = {}
          if (args.name) {
            updateBody.name = args.name
          }
          if (args.description) {
            updateBody.description = args.description
          }
          if (args.deploy) {
            updateBody.deployed = args.deploy
          }

          if ('order' in args) {
            updateBody.order = args.order
            oldOrder = (await ctx
              .knex('class_units')
              .where({ id: args.unit_id })
              .select('order')
              .first()).order
          }
          const res = await ctx
            .knex('class_units')
            .where({ id: args.unit_id })
            .update(updateBody)
            .returning('*')
          updatedUnit = res[0]
        }
        if (args.add_files) {
          await ctx
            .knex('class_files')
            .whereIn('id', args.add_files)
            .update({ unit_id: args.unit_id })
        }
        if (!updatedUnit) {
          updatedUnit = await ctx
            .knex('class_units')
            .where({ id: args.unit_id })
        }

        // increment the order on all higher
        if ('order' in args) {
          const delta = oldOrder > args.order ? 1 : -1
          const range = [oldOrder, args.order].sort()
          await ctx
            .knex('class_units')
            .where({ class_id: updatedUnit.class_id })
            .andWhereBetween('order', range as any)
            .andWhereNot({ id: args.unit_id })
            .increment('order', delta)
        }

        return updatedUnit
      },
    })

    t.boolean('rmClassUnit', {
      args: { unit_id: idArg() },
      resolve: async (_, { unit_id }, ctx) => {
        await ctx
          .knex('class_files')
          .where({ unit_id })
          .del()
        await ctx
          .knex('class_units')
          .where({ id: unit_id })
          .del()
        return true
      },
    })
  },
})
