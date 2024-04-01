import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import JwtConfig from "../config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { TokenPayload } from "src/shared/entities/token-payload.entity";
import { Auth } from "../decorators/auth.decorator";
import { AuthType } from "../enums/auth-type.enum";

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, token] = request.headers.authorization?.split(" ") ?? [];
    return token;
  }

  async canActivate(ctx: ExecutionContext) {
    const authType = this.reflector.get(Auth, ctx.getHandler());
    if (authType == AuthType.None) return true;
    const request = ctx.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException("Token not found");
    try {
      const payload: TokenPayload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfig,
      );
      request.user = payload;
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
    return true;
  }
}
