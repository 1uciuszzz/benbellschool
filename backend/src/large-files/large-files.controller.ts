import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { LargeFilesService } from "./large-files.service";
import { LargeFilesInDto } from "./dto/large-files.in.dto";
import { MinioService, PartItem } from "src/minio.service";
import { FilePartInDto } from "./dto/file-part.in.dto";
import { CompleteUploadInDto } from "./dto/complete-upload.in.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { Readable } from "stream";
import { Auth } from "src/auth/decorators/auth.decorator";
import { AuthType } from "src/auth/enums/auth-type.enum";
import { Permissions } from "src/auth/decorators/permissions.decorator";
import { Permission } from "src/shared/enums/permission.enum";

@Controller("large-files")
export class LargeFilesController {
  private readonly CHUNK_SIZE = 64 * 1024 * 1024;

  constructor(
    private readonly largeFilesService: LargeFilesService,
    private readonly minio: MinioService,
  ) {}

  @Post()
  @Auth(AuthType.Bearer)
  @Permissions(Permission.LARGEFILE_UPLOAD)
  async uploadLargeFile(@Body() payload: LargeFilesInDto) {
    const largeFile = await this.largeFilesService.getLargeFileBySHA256(
      payload.sha256,
    );
    if (largeFile) {
      if (!largeFile.uploadId) {
        return largeFile;
      } else {
        const parts = await this.largeFilesService.getParts(payload.sha256);
        const chunks = Math.ceil(payload.size / this.CHUNK_SIZE);
        const needToUpload = [];
        for (let i = 1; i <= chunks; i++) {
          const part = parts.find((part) => part.partNumber === i);
          if (!part) {
            needToUpload.push(i);
          }
        }
        return { ...largeFile, needToUpload };
      }
    } else {
      const chunks = Math.ceil(payload.size / this.CHUNK_SIZE);
      const uploadId = await this.minio.createMultipartUpload(payload.sha256);
      const unfinished = await this.largeFilesService.createLargeFile(
        payload.sha256,
        payload.mimeType,
        payload.name,
        payload.size.toString(),
        uploadId,
      );
      return {
        ...unfinished,
        needToUpload: Array.from({ length: chunks }, (_, i) => i + 1),
      };
    }
  }

  @Post(":sha256/parts/:partNumber")
  @Auth(AuthType.Bearer)
  @Permissions(Permission.LARGEFILE_UPLOAD)
  @UseInterceptors(FileInterceptor("filepart"))
  async uploadPart(
    @Param("sha256") sha256: string,
    @Param("partNumber") partNumber: number,
    @UploadedFile() filepart: Express.Multer.File,
    @Body() payload: FilePartInDto,
  ) {
    const etag = await this.minio.uploadPart(
      sha256,
      partNumber,
      payload.uploadId,
      filepart.buffer,
    );
    const part = await this.largeFilesService.createPart(
      payload.largeFileId,
      partNumber,
      etag,
    );
    return part;
  }

  @Patch(":sha256")
  @Auth(AuthType.Bearer)
  @Permissions(Permission.LARGEFILE_UPLOAD)
  async completeLargeFile(
    @Param("sha256") sha256: string,
    @Body() payload: CompleteUploadInDto,
  ) {
    const fileParts = await this.largeFilesService.getParts(sha256);
    const parts: PartItem[] = fileParts.map((part) => ({
      PartNumber: part.partNumber,
      ETag: part.etag,
    }));
    await this.minio.completeMultipartUpload(sha256, payload.uploadId, parts);
    const largeFile = await this.largeFilesService.completeLargeFile(sha256);
    return largeFile;
  }

  @Get(":id")
  @Auth(AuthType.None)
  @Permissions(Permission.NONE)
  async getLargeFile(
    @Param("id") id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const largeFile = await this.largeFilesService.getLargeFile(id);
    const file = await this.minio.getFileBySHA256(largeFile.sha256);
    const suffix = largeFile.name.split(".").pop();
    const stream = Readable.from(file);
    response.set({
      "Content-Disposition": `inline; filename="${largeFile.sha256}.${suffix}"`,
      "Content-Type": largeFile.mimeType,
    });
    return new StreamableFile(stream);
  }
}
