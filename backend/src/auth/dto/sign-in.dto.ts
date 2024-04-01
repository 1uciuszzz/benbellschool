import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
  @ApiProperty({ description: "Username must be unique" })
  username: string;

  @ApiProperty({ description: "Password must be at least 8 characters" })
  password: string;
}
