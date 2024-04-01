import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";
import { Auth } from "./decorators/auth.decorator";
import { AuthType } from "./enums/auth-type.enum";
import { User } from "src/shared/decorators/user.decorator";
import { TokenPayload } from "src/shared/entities/token-payload.entity";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  @Auth(AuthType.None)
  async signIn(@Body() payload: SignInDto) {
    let user = await this.authService.signIn(payload.name);
    if (!user) {
      user = await this.authService.signUp(payload.name);
    }
    const token = await this.authService.generateToken(user.id, user.name);
    return { token };
  }

  @Get()
  @Auth(AuthType.Bearer)
  getUserInfo(@User() user: TokenPayload) {
    return this.authService.getUserInfo(user.sub);
  }
}
