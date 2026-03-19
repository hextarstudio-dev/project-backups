import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  type _Object
} from '@aws-sdk/client-s3';

type PutOptions = { httpMetadata?: { contentType?: string } };

export class NodeR2Bucket {
  private s3: S3Client;
  private bucket: string;

  constructor() {
    const endpoint = process.env.R2_ENDPOINT;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucket = process.env.R2_BUCKET;

    if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
      throw new Error('R2 vars missing: R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET');
    }

    this.bucket = bucket;
    this.s3 = new S3Client({
      region: 'auto',
      endpoint,
      credentials: { accessKeyId, secretAccessKey }
    });
  }

  async put(key: string, body: ArrayBuffer | Uint8Array, opts?: PutOptions) {
    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body instanceof Uint8Array ? body : new Uint8Array(body),
      ContentType: opts?.httpMetadata?.contentType
    }));
  }

  async delete(key: string) {
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  async list(params: { prefix?: string; limit?: number }) {
    const out = await this.s3.send(new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: params.prefix,
      MaxKeys: params.limit ?? 1000
    }));

    return {
      objects: (out.Contents ?? []).map((o: _Object) => ({
        key: o.Key ?? '',
        size: o.Size,
        uploaded: o.LastModified,
        etag: o.ETag
      }))
    };
  }
}
