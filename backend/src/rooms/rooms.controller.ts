import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { Auth } from "src/auth/decorators/auth.decorator";
import { AuthType } from "src/auth/enums/auth-type.enum";
import { User } from "src/shared/decorators/user.decorator";
import { TokenPayload } from "src/shared/entities/token-payload.entity";

@Controller("rooms")
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @Auth(AuthType.Bearer)
  async createRoom(@User() user: TokenPayload) {
    return await this.roomsService.createRoom(user.name);
  }

  @Get(":roomId")
  @Auth(AuthType.Bearer)
  async getRoomDetails(@Param("roomId") roomId: string) {
    const room = await this.roomsService.getRoom(roomId);
    const roomUsers = await this.roomsService.getRoomUsers(roomId);
    const expenditureStats =
      await this.roomsService.getUsersExpenditureStats(roomId);
    const expenditures = await this.roomsService.getExpenditures(roomId);
    return { room, roomUsers, expenditureStats, expenditures };
  }

  @Get(":roomId/users")
  @Auth(AuthType.Bearer)
  async getRoomUsers(@Param("roomId") roomId: string) {
    return await this.roomsService.getRoomUsers(roomId);
  }

  @Post("join/:roomId")
  @Auth(AuthType.Bearer)
  async joinRoom(@User() user: TokenPayload, @Param("roomId") roomId: string) {
    const isInRoom = await this.roomsService.isInRoom(user.sub, roomId);
    if (isInRoom) throw new ForbiddenException("You are already in the room");
    return await this.roomsService.joinRoom(user.sub, roomId);
  }

  @Get()
  @Auth(AuthType.Bearer)
  async getRooms(@Query("page") page: number, @Query("size") size: number) {
    page = page || 1;
    size = size || 10;
    const skip = (page - 1) * size;
    const rooms = await this.roomsService.getRooms(skip, size);
    const total = await this.roomsService.getCount();
    return { total, rooms };
  }

  @Patch(":roomId/close")
  @Auth(AuthType.Bearer)
  async closeRoom(@Param("roomId") roomId: string) {
    return await this.roomsService.closeRoom(roomId);
  }
}
