import * as AWS from 'aws-sdk'
import { Stream } from 'stream'
import { S3 } from 'aws-sdk'
import { randomBytes } from 'crypto'
import { promisify } from 'util'

const makeRandBytes = promisify(randomBytes)

const setupClient = () => {
  if (!process.env.FILE_STORAGE_ENDPOINT) {
    throw new Error('Missing ENV VAr $FILE_STORAGE_ENDPOINT')
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
    // setup the public bucket automatically if it does not yet exist
    ;(async () => {
      if (!(await this.storageHasBucket(this.getPublicBucket()))) {
        await this.createPublicBucket(this.getPublicBucket())
      }
    })().catch(console.warn)
  }

  private async createPublicBucket(name: string) {
    await this.client
      .createBucket({ Bucket: name, ACL: 'public-read' })
      .promise()
    await this.client
      .putBucketPolicy({
        Bucket: name,
        Policy: JSON.stringify({
          Statement: [
            {
              Action: ['s3:GetBucketLocation', 's3:ListBucket'],
              Effect: 'Allow',
              Principal: {
                AWS: ['*'],
              },
              Resource: [`arn:aws:s3:::${name}`],
            },
            {
              Action: ['s3:GetObject'],
              Effect: 'Allow',
              Principal: {
                AWS: ['*'],
              },
              Resource: [`arn:aws:s3:::${name}/*`],
            },
          ],
          Version: '2012-10-17',
        }),
      })
      .promise()
  }

  private async storageHasBucket(bucket: string): Promise<boolean> {
    try {
      const res = await this.client.getBucketAcl({ Bucket: bucket }).promise()
      if (res.$response.data) {
        return true
      }
    } catch (err) {}
    return false
  }

  private getUrl(bucket: string, key: string) {
    return `${this.client.endpoint.href}/${bucket}/${key}`
  }

  getPublicBucket(): string {
    if (!process.env.PUBLIC_STORAGE_BUCKET) {
      throw new Error('Missing env var $PUBLIC_STORAGE_BUCKET')
    }
    return process.env.PUBLIC_STORAGE_BUCKET
  }

  async uploadFile(
    bucket: string,
    incomingFile: Stream,
    type: string,
  ): Promise<IUploadFileResult> {
    const Key = (await makeRandBytes(32)).toString('hex')
    const result = await this.client
      .upload({ Body: incomingFile, Bucket: bucket, Key, ContentType: type })
      .promise()
    return { url: result.Location, key: Key, bucket: bucket }
  }

  async cloneFile(
    fileKey: string,
    oldBucket: string,
    newBucket: string,
  ): Promise<IUploadFileResult> {
    const newKey = (await makeRandBytes(32)).toString('hex')
    await this.client
      .copyObject({
        Bucket: newBucket,
        Key: newKey,
        CopySource: `/${oldBucket}/${fileKey}`,
        ACL: 'public-read',
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
  async deleteFile(bucket: string, fileKey: string): Promise<boolean> {
    const result = await this.client
      .deleteObject({ Bucket: bucket, Key: fileKey })
      .promise()
    if (result) {
      return true
    }
    return false
  }
}
