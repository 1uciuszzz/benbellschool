import { ApiProperty } from "@nestjs/swagger";

export class RoleInDto {
  @ApiProperty({ description: "Role name" })
  name: string;

  @ApiProperty({ description: "Role description" })
  description: string;

  @ApiProperty({ description: "Role status", required: false })
  active?: boolean;
}
