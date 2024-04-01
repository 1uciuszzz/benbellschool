import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FilesService } from "./files.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Readable } from "stream";
import { Response } from "express";
import { Auth } from "src/auth/decorators/auth.decorator";
import { AuthType } from "src/auth/enums/auth-type.enum";
import { Permissions } from "src/auth/decorators/permissions.decorator";
import { Permission } from "src/shared/enums/permission.enum";

@Controller("files")
export class FilesController {
  private readonly MAX_FILE_SIZE = 512 * 1024 * 1024;

  constructor(private readonly filesService: FilesService) {}

  @Post()
  @Auth(AuthType.Bearer)
  @Permissions(Permission.FILE_UPLOAD)
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error("File is too large, please use the large-files endpoint");
    }
    const sha256 = await this.filesService.getSHA256(file);
    const isExistingFile = await this.filesService.getFileBySHA256(sha256);
    if (isExistingFile) {
      return isExistingFile;
    }
    return this.filesService.uploadFile(
      sha256,
      file.size,
      file.buffer,
      file.mimetype,
    );
  }

  @Get(":id")
  @Auth(AuthType.None)
  @Permissions(Permission.NONE)
  async getFiles(
    @Param("id") id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const file = await this.filesService.getFile(id);
    const stream = Readable.from(file.bytes);
    response.set({
      "Content-Disposition": `inline; filename="${file.id}"`,
      "Content-Type": file.mimeType,
    });
    return new StreamableFile(stream);
  }
}
