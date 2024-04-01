import { Injectable } from "@nestjs/common";
import { MinioService } from "src/minio.service";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class LargeFilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minio: MinioService,
  ) {}

  async getLargeFileBySHA256(sha256: string) {
    return this.prisma.largeFile.findUnique({
      where: { sha256 },
    });
  }

  async createLargeFile(
    sha256: string,
    mimeType: string,
    name: string,
    size: string,
    uploadId: string,
  ) {
    return this.prisma.largeFile.create({
      data: {
        sha256,
        mimeType,
        name,
        size,
        uploadId,
      },
    });
  }

  async getParts(sha256: string) {
    const largeFile = await this.prisma.largeFile.findUnique({
      where: {
        sha256,
      },
      include: {
        chunks: {
          orderBy: {
            partNumber: "asc",
          },
        },
      },
    });
    return largeFile.chunks;
  }

  async createPart(largeFileId: string, partNumber: number, etag: string) {
    return this.prisma.largeFileChunk.create({
      data: {
        largeFileId,
        partNumber,
        etag,
      },
    });
  }

  async completeLargeFile(sha256: string) {
    const largeFile = await this.prisma.largeFile.update({
      where: {
        sha256,
      },
      data: {
        uploadId: null,
      },
    });
    await this.prisma.largeFileChunk.deleteMany({
      where: {
        largeFileId: largeFile.id,
      },
    });
    return largeFile;
  }

  async getLargeFile(id: string) {
    return this.prisma.largeFile.findUnique({
      where: {
        id,
      },
    });
  }
}
