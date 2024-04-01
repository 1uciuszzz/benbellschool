import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(userName: string) {
    return await this.prisma.room.create({
      data: {
        name: `${new Date().getTime()}：${userName}创建的房间`,
      },
    });
  }

  async joinRoom(userId: string, roomId: string) {
    return await this.prisma.roomUser.create({
      data: {
        roomId,
        userId,
      },
    });
  }

  async getRoomUsers(roomId: string) {
    const roomUserMap = await this.prisma.roomUser.findMany({
      where: {
        roomId,
      },
    });
    const userIds = roomUserMap.map((item) => item.userId);
    return await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
  }

  async getRooms() {
    return await this.prisma.room.findMany();
  }

  async getUsersExpenditureStats(roomId: string) {
    const roomUsers = await this.getRoomUsers(roomId);
    const userStats = new Map<string, number>();
    roomUsers.forEach((user) => {
      userStats.set(user.id, 0);
    });
    const expenditures = await this.prisma.expenditure.findMany({
      where: {
        roomId,
      },
    });
    expenditures.forEach((expenditure) => {
      userStats.set(
        expenditure.payerId,
        userStats.get(expenditure.payerId) - expenditure.amount,
      );
      userStats.set(
        expenditure.payeeId,
        userStats.get(expenditure.payeeId) + expenditure.amount,
      );
    });
    return userStats;
  }
}
