import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ExpendituresService } from "./expenditures.service";
import { ExpendituresController } from "./expenditures.controller";

@Module({
  imports: [],
  controllers: [ExpendituresController],
  providers: [PrismaService, ExpendituresService],
})
export class ExpendituresModule {}
