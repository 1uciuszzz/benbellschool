import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
  @ApiProperty({ description: "Name must be unique" })
  name: string;
}
