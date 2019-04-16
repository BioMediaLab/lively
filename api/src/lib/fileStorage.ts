import * as AWS from 'aws-sdk'
import { Stream } from 'stream'
import { S3 } from 'aws-sdk'
import { randomBytes } from 'crypto'
import { promisify } from 'util'

const randomString = promisify(randomBytes)

const setupClient = () => {
  if (!process.env.FILE_STORAGE_ENDPOINT) {
    throw new Error('NO Object Storage Endpoint')
  }
  return new AWS.S3({
    accessKeyId: process.env.FILE_STORAGE_ID,
    secretAccessKey: process.env.FILE_STORAGE_SECRET,
    endpoint: process.env.FILE_STORAGE_ENDPOINT,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
  })
}

export class ObjectStorage {
  client: S3
  constructor() {
    this.client = setupClient()
  }
  uploadFile = async (file: Stream, type: string): Promise<string> => {
    const Key = (await randomString(32)).toString('hex')
    const result = await this.client
      .upload({ Body: file, Bucket: 'test', Key, ContentType: type })
      .promise()
    return result.Location
  }
}
