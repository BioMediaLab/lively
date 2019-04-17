import * as AWS from 'aws-sdk'
import { Stream } from 'stream'
import { S3 } from 'aws-sdk'
import { randomBytes } from 'crypto'
import { promisify } from 'util'

const makeRandBytes = promisify(randomBytes)

const setupClient = () => {
  if (!process.env.FILE_STORAGE_ENDPOINT) {
    throw new Error('No Object Storage Endpoint')
  }
  return new AWS.S3({
    accessKeyId: process.env.FILE_STORAGE_ID,
    secretAccessKey: process.env.FILE_STORAGE_SECRET,
    endpoint: process.env.FILE_STORAGE_ENDPOINT,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
  })
}

interface IUploadFileResult {
  url: string
  key: string
  bucket: string
}

/**
 * A friendly singleton interface to the s3 api
 *
 */
export class ObjectStorage {
  client: S3
  constructor() {
    this.client = setupClient()
  }

  getUrl(bucket: string, key: string) {
    return `${this.client.endpoint.href}/${bucket}/${key}`
  }

  uploadFile = async (
    file: Stream,
    type: string,
  ): Promise<IUploadFileResult> => {
    const Key = (await makeRandBytes(32)).toString('hex')
    const result = await this.client
      .upload({ Body: file, Bucket: 'test', Key, ContentType: type })
      .promise()
    return { url: result.Location, key: Key, bucket: 'test' }
  }

  cloneFile = async (fileKey: string): Promise<IUploadFileResult> => {
    const newKey = (await makeRandBytes(32)).toString('hex')
    await this.client
      .copyObject({
        Bucket: 'test',
        Key: newKey,
        CopySource: `/test/${fileKey}`,
      })
      .promise()
    return {
      url: this.getUrl('test', newKey),
      key: newKey,
      bucket: 'test',
    }
  }

  /**
   * Returns whether or not the file was successfully deleted.
   */
  deleteFile = async (fileKey: string): Promise<boolean> => {
    const result = await this.client
      .deleteObject({ Bucket: 'test', Key: fileKey })
      .promise()
    if (result) {
      return true
    }
    return false
  }
}
