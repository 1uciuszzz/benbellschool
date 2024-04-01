import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoom(roomId: string) {
    return await this.prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });
  }

  async createRoom(userName: string) {
    return await this.prisma.room.create({
      data: {
        name: `${userName}创建的房间`,
      },
    });
  }

  async isInRoom(userId: string, roomId: string) {
    return await this.prisma.roomUser.findFirst({
      where: {
        userId,
        roomId,
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
    const roomUsers = await this.prisma.roomUser.findMany({
      where: {
        roomId,
      },
    });
    const userIds = roomUsers.map((item) => item.userId);
    return await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
  }

  async getRooms() {
    return await this.prisma.room.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getUsersExpenditureStats(roomId: string) {
    const roomUsers = await this.getRoomUsers(roomId);
    const userStats = roomUsers.map((user) => {
      return {
        userId: user.id,
        amount: 0,
      };
    });
    const expenditures = await this.prisma.expenditure.findMany({
      where: {
        roomId,
      },
    });
    expenditures.forEach((expenditure) => {
      userStats.map((user) => {
        if (user.userId === expenditure.payerId) {
          user.amount -= expenditure.amount;
        }
        if (user.userId === expenditure.payeeId) {
          user.amount += expenditure.amount;
        }
        return user;
      });
    });
    return userStats;
  }

  async getExpenditures(roomId: string) {
    return await this.prisma.expenditure.findMany({
      where: {
        roomId,
      },
      orderBy: {
        createAt: "desc",
      },
    });
  }
}
