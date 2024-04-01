import { ApiProperty } from "@nestjs/swagger";

export class LargeFilesInDto {
  @ApiProperty({ description: "The SHA256 hash of the file" })
  sha256: string;

  @ApiProperty({ description: "The name of the file" })
  name: string;

  @ApiProperty({ description: "The size of the file in bytes" })
  size: number;

  @ApiProperty({ description: "The MIME type of the file" })
  mimeType: string;
}
