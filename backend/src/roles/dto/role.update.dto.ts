import { ApiProperty } from "@nestjs/swagger";

export class RoleUpdateDto {
  @ApiProperty({ description: "Role name" })
  name?: string;

  @ApiProperty({ description: "Role description" })
  description?: string;

  @ApiProperty({ description: "Role status", required: false })
  active?: boolean;

  @ApiProperty({ description: "User ids" })
  userIds?: string[];

  @ApiProperty({ description: "Permission ids" })
  permissionIds?: string[];
}
