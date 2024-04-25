import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { PrismaService } from "src/prisma.service";
import { Achievement } from "./dto/achievement.dto";

@Injectable()
export class AchievementsService {
  constructor(private readonly prisma: PrismaService) {}

  getCount = async (userId: string) => {
    const count = await this.prisma.roomUser.count({
      where: {
        userId,
      },
    });
    return count;
  };

  getWinCount = async (userId: string) => {
    let winCount = 0;
    const roomIds = await this.prisma.roomUser.findMany({
      select: {
        roomId: true,
        userId: false,
      },
      where: {
        userId,
      },
    });
    for (let i = 0; i < roomIds.length; i++) {
      const payNumber = await this.prisma.expenditure.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          roomId: roomIds[i].roomId,
          payerId: userId,
        },
      });
      const receiveNumber = await this.prisma.expenditure.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          roomId: roomIds[i].roomId,
          payeeId: userId,
        },
      });
      if (payNumber._sum.amount < receiveNumber._sum.amount) {
        winCount++;
      }
    }
    return winCount;
  };

  getZeroCount = async (userId: string) => {
    let zeroCount = 0;
    const roomIds = await this.prisma.roomUser.findMany({
      select: {
        roomId: true,
        userId: false,
      },
      where: {
        userId,
      },
    });
    for (let i = 0; i < roomIds.length; i++) {
      const payNumber = await this.prisma.expenditure.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          roomId: roomIds[i].roomId,
          payerId: userId,
        },
      });
      const receiveNumber = await this.prisma.expenditure.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          roomId: roomIds[i].roomId,
          payeeId: userId,
        },
      });
      if (payNumber._sum.amount === receiveNumber._sum.amount) {
        zeroCount++;
      }
    }
    return zeroCount;
  };

  getAllAchievements = async (userId: string, skip: number, take: number) => {
    const rooms = await this.prisma.roomUser.findMany({
      select: {
        roomId: true,
        userId: false,
      },
      where: {
        userId,
      },
      skip,
      take,
    });
    const achievements: Achievement[] = [];
    for (let i = 0; i < rooms.length; i++) {
      const payNumber = await this.prisma.expenditure.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          roomId: rooms[i].roomId,
          payerId: userId,
        },
      });
      const receiveNumber = await this.prisma.expenditure.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          roomId: rooms[i].roomId,
          payeeId: userId,
        },
      });
      const room = await this.prisma.room.findUnique({
        where: {
          id: rooms[i].roomId,
          active: false,
        },
      });
      if (!room) {
        continue;
      }
      achievements.push({
        id: randomUUID(),
        roomName: room.name,
        winNumber: receiveNumber._sum.amount - payNumber._sum.amount,
        date: room.updatedAt.toLocaleString(),
      });
    }
    achievements.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return achievements;
  };
}
