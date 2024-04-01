import { Controller, Get, Param, Post } from "@nestjs/common";
import { ExpendituresService } from "./expenditures.service";
import { Auth } from "src/auth/decorators/auth.decorator";
import { AuthType } from "src/auth/enums/auth-type.enum";
import { User } from "src/shared/decorators/user.decorator";
import { TokenPayload } from "src/shared/entities/token-payload.entity";

@Controller("expenditures")
export class ExpendituresController {
  constructor(private readonly expendituresService: ExpendituresService) {}

  @Post(":roomId/:payeeId/:amount")
  @Auth(AuthType.Bearer)
  async createExpenditure(
    @User() user: TokenPayload,
    @Param("roomId") roomId: string,
    @Param("payeeId") payeeId: string,
    @Param("amount") amount: number,
  ) {
    return await this.expendituresService.createExpenditure(
      roomId,
      user.sub,
      payeeId,
      amount,
    );
  }

  @Get()
  @Auth(AuthType.Bearer)
  async getExpenditures() {
    return await this.expendituresService.getExpenditures();
  }
}
