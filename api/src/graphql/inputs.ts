import { asNexusMethod, inputObjectType } from 'yoga'
import { GraphQLUpload } from 'graphql-upload'

// Create a custom scalar for Nexus that corresponds to the
// Upload type in ApolloServer2
// see https://nexus.js.org/docs/api-scalartype
export const Upload = asNexusMethod(GraphQLUpload, 'upload')

export const FileUpload = inputObjectType({
  name: 'FileUpload',
  definition(t) {
    // @ts-ignore: this is defined by the `asNexusMethod` call above
    t.upload('file')

    // users may wish to give the uploaded context a custom name.
    // easier to handle that here than later
    t.string('name', { required: false })
  },
})
