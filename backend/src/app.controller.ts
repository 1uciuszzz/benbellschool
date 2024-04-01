import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { Auth } from "./auth/decorators/auth.decorator";
import { AuthType } from "./auth/enums/auth-type.enum";
import { Permissions } from "./auth/decorators/permissions.decorator";
import { Permission } from "./shared/enums/permission.enum";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Auth(AuthType.None)
  @Permissions(Permission.NONE)
  getMeta() {
    return {
      name: "threed constrol system",
      version: "1.0.0",
    };
  }
}
