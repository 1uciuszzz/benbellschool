import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { Readable } from "stream";

export interface PartItem {
  ETag: string;
  PartNumber: number;
}

@Injectable()
export class MinioService {
  private readonly client: S3Client;
  private readonly bucket = process.env.MINIO_BUCKET;

  constructor() {
    this.client = new S3Client({
      endpoint: process.env.MINIO_ENDPOINT,
      region: "ap-east-1",
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY,
        secretAccessKey: process.env.MINIO_SECRET_KEY,
      },
    });
  }

  /**
   * @param sha256 File SHA256
   * @returns UploadId
   */
  async createMultipartUpload(sha256: string): Promise<string> {
    const command = new CreateMultipartUploadCommand({
      Bucket: this.bucket,
      Key: sha256,
    });
    const response = await this.client.send(command);
    return response.UploadId;
  }

  /**
   * @param sha256 File SHA256
   * @param partNumber Part number
   * @param uploadId UploadId
   * @param bytes File bytes
   * @returns Etag
   */
  async uploadPart(
    sha256: string,
    partNumber: number,
    uploadId: string,
    bytes: Buffer,
  ): Promise<string> {
    const command = new UploadPartCommand({
      Bucket: this.bucket,
      Key: sha256,
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: bytes,
    });
    const res = await this.client.send(command);
    return res.ETag;
  }

  /**
   * @param sha256 File SHA256
   * @param uploadId UploadId
   * @param parts Parts
   */
  async completeMultipartUpload(
    sha256: string,
    uploadId: string,
    parts: PartItem[],
  ): Promise<void> {
    const command = new CompleteMultipartUploadCommand({
      Bucket: this.bucket,
      Key: sha256,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts,
      },
    });
    await this.client.send(command);
  }

  async getFileBySHA256(sha256: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: sha256,
    });
    const res = await this.client.send(command);
    return res.Body as Readable;
  }
}
