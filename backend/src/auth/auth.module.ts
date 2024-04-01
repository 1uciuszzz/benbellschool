import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "src/prisma.service";
import { BcryptService } from "src/bcrypt.service";
import { JwtModule } from "@nestjs/jwt";
import JwtConfig from "./config/jwt.config";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    JwtModule.registerAsync(JwtConfig.asProvider()),
    ConfigModule.forFeature(JwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, BcryptService],
  exports: [AuthService],
})
export class AuthModule {}
