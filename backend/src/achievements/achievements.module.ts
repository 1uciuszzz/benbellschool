import { Module } from "@nestjs/common";
import { AchievementsController } from "./achievements.controller";
import { AchievementsService } from "./achievements.service";
import { PrismaService } from "src/prisma.service";

@Module({
  controllers: [AchievementsController],
  providers: [AchievementsService, PrismaService],
})
export class AchievementsModule {}
