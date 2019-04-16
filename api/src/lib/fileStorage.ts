import * as AWS from 'aws-sdk'

const setupClient = () => {
  return new AWS.S3({
    accessKeyId: process.env.FILE_STORAGE_ID,
    secretAccessKey: process.env.FILE_STORAGE_SECRET,
    endpoint: process.env.FILE_STORAGE_ENDPOINT,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
  })
}

const client = setupClient()
