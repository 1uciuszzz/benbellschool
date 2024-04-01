import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FilesModule } from "./files/files.module";
import { LargeFilesModule } from "./large-files/large-files.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { TokenGuard } from "./auth/guards/token.guard";
import { JwtModule } from "@nestjs/jwt";
import JwtConfig from "./auth/config/jwt.config";
import { ConfigModule } from "@nestjs/config";
import { PermissionGuard } from "./auth/guards/permission.guard";
import { RolesModule } from "./roles/roles.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    AuthModule,
    FilesModule,
    LargeFilesModule,
    JwtModule.registerAsync(JwtConfig.asProvider()),
    ConfigModule.forFeature(JwtConfig),
    RolesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: TokenGuard },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
