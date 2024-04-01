import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ExpendituresService {
  constructor(private readonly prisma: PrismaService) {}

  async createExpenditure(
    roomId: string,
    payerId: string,
    payeeId: string,
    amount: number,
  ) {
    return await this.prisma.expenditure.create({
      data: {
        amount,
        payeeId,
        payerId,
        roomId,
      },
    });
  }
}
