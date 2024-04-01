import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "@prisma/client";

export class SignUpDto {
  @ApiProperty({ description: "Username must be unique" })
  username: string;

  @ApiProperty({ description: "Password must be at least 8 characters" })
  password: string;

  @ApiProperty({ description: "Name of the user" })
  name: string;

  @ApiProperty({ description: "Phone number of the user" })
  phone: string;

  @ApiProperty({ description: "Identity card number of the user" })
  icNumber: string;

  @ApiProperty({ description: "Gender of the user", enum: Gender })
  gender: Gender;

  @ApiProperty({ description: "Email of the user" })
  email: string;
}
