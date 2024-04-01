import { ApiProperty } from "@nestjs/swagger";

export class FilePartInDto {
  @ApiProperty({
    description: "The id of the large file to which the part belongs",
  })
  largeFileId: string;

  @ApiProperty({ description: "Minio create multipart upload id" })
  uploadId: string;

  @ApiProperty({ description: "The sliced part of the file" })
  buffer: Buffer;
}
