import { Controller, Get, Query } from "@nestjs/common";
import { AchievementsService } from "./achievements.service";
import { Auth } from "src/auth/decorators/auth.decorator";
import { AuthType } from "src/auth/enums/auth-type.enum";
import { User } from "src/shared/decorators/user.decorator";
import { TokenPayload } from "src/shared/entities/token-payload.entity";

@Controller("achievements")
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get("status")
  @Auth(AuthType.Bearer)
  async getAchievementStatus(@User() user: TokenPayload) {
    const total = await this.achievementsService.getCount(user.sub);
    const winCount = await this.achievementsService.getWinCount(user.sub);
    const zeroCount = await this.achievementsService.getZeroCount(user.sub);
    const winRate =
      total === 0 ? 0 : ((winCount / (total - zeroCount)) * 100).toFixed(2);
    return { total, winCount, winRate };
  }

  @Get()
  @Auth(AuthType.Bearer)
  async getAllAchievements(
    @User() user: TokenPayload,
    @Query("page") page: number,
    @Query("size") size: number,
  ) {
    page = page || 1;
    size = size || 10;
    const skip = (page - 1) * size;
    const total = await this.achievementsService.getCount(user.sub);
    const achievements = await this.achievementsService.getAllAchievements(
      user.sub,
      skip,
      size,
    );
    return { total, achievements };
  }
}
