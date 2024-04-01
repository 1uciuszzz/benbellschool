import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Permissions } from "../decorators/permissions.decorator";
import { TokenPayload } from "src/shared/entities/token-payload.entity";
import { AuthService } from "../auth.service";
import { Permission } from "src/shared/enums/permission.enum";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(ctx: ExecutionContext) {
    const permission = this.reflector.get(Permissions, ctx.getHandler());
    if (permission == Permission.NONE) return true;
    const request = ctx.switchToHttp().getRequest();
    const user: TokenPayload = request.user;
    if (!user.roleId) throw new ForbiddenException("Role not found");
    const pass = await this.authService.checkPermissions(
      user.roleId,
      permission,
    );
    return pass;
  }
}
