import { ApiProperty } from "@nestjs/swagger";

export class CompleteUploadInDto {
  @ApiProperty({ description: "Minio create multipart upload id" })
  uploadId: string;
}
