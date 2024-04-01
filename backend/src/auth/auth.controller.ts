import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { Auth } from "./decorators/auth.decorator";
import { AuthType } from "./enums/auth-type.enum";
import { Permissions } from "./decorators/permissions.decorator";
import { Permission } from "src/shared/enums/permission.enum";
import { User } from "src/shared/decorators/user.decorator";
import { TokenPayload } from "src/shared/entities/token-payload.entity";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  @Auth(AuthType.None)
  @Permissions(Permission.NONE)
  async signUp(@Body() payload: SignUpDto) {
    const exist = await this.authService.getUserByUsername(payload.username);
    if (exist) throw new ForbiddenException("Username already exists");
    const newUser = await this.authService.signUp(
      payload.username,
      payload.password,
      payload.name,
      payload.gender,
      payload.icNumber,
      payload.email,
      payload.phone,
    );
    newUser.password = undefined;
    return newUser;
  }

  @Post("sign-in")
  @Auth(AuthType.None)
  @Permissions(Permission.NONE)
  async signIn(@Body() payload: SignInDto) {
    const user = await this.authService.signIn(
      payload.username,
      payload.password,
    );
    if (!user) throw new ForbiddenException("Invalid username or password");
    if (!user.active) {
      throw new ForbiddenException("User is inactive");
    }
    const token = await this.authService.generateToken(user.id, user.roleId);
    return { token };
  }

  @Get()
  @Auth(AuthType.Bearer)
  @Permissions(Permission.NONE)
  getUserInfo(@User() user: TokenPayload) {
    return this.authService.getUserInfo(user.sub);
  }
}
