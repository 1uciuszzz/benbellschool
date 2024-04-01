import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import crypto from "crypto";

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadFile(
    sha256: string,
    size: number,
    bytes: Buffer,
    mimeType: string,
  ) {
    return this.prisma.file.create({
      data: {
        sha256,
        bytes,
        size,
        mimeType,
      },
    });
  }

  async getFile(id: string) {
    return this.prisma.file.findUnique({
      where: {
        id,
      },
    });
  }

  async getSHA256(file: Express.Multer.File) {
    const hash = crypto.createHash("sha256");
    hash.update(file.buffer);
    return hash.digest("hex");
  }

  async getFileBySHA256(sha256: string) {
    const file = await this.prisma.file.findUnique({
      where: {
        sha256,
      },
    });
    return file;
  }
}
