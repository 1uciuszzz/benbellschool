import { Module } from "@nestjs/common";
import { LargeFilesController } from "./large-files.controller";
import { LargeFilesService } from "./large-files.service";
import { MinioService } from "src/minio.service";
import { PrismaService } from "src/prisma.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [LargeFilesController],
  providers: [LargeFilesService, PrismaService, MinioService],
})
export class LargeFilesModule {}
