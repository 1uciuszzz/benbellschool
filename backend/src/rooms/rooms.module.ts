import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { RoomsController } from "./rooms.controller";
import { RoomsService } from "./rooms.service";

@Module({
  imports: [],
  controllers: [RoomsController],
  providers: [PrismaService, RoomsService],
})
export class RoomsModule {}
