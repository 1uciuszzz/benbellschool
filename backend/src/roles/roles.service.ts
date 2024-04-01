import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async createRole(name: string, description: string, active?: boolean) {
    const role = await this.prisma.role.create({
      data: {
        name,
        description,
        active,
      },
    });
    return role;
  }

  async deleteRole(id: string) {
    const role = await this.prisma.role.delete({
      where: {
        id,
      },
    });
    return role;
  }

  async getRoleById(id: string) {
    const role = await this.prisma.role.findUnique({
      where: {
        id,
      },
    });
    return role;
  }

  async getRoleByName(name: string) {
    const role = await this.prisma.role.findUnique({
      where: {
        name,
      },
    });
    return role;
  }

  async updateRole(
    id: string,
    name?: string,
    description?: string,
    active?: boolean,
    userIds?: string[],
    permissionIds?: string[],
  ) {
    const role = await this.prisma.role.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        active,
      },
    });
    if (permissionIds) {
      await this.prisma.rolePermission.deleteMany({
        where: {
          roleId: id,
        },
      });
      await this.prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => {
          return {
            permissionId,
            roleId: id,
          };
        }),
      });
    }
    if (userIds) {
      await this.prisma.user.updateMany({
        where: {
          id: {
            in: userIds,
          },
        },
        data: {
          roleId: id,
        },
      });
    }
    return role;
  }

  async getRoles(page: number, limit: number, name?: string, active?: boolean) {
    const take = limit;
    const skip = (page - 1) * limit;
    const roles = await this.prisma.role.findMany({
      where: {
        name: {
          contains: name,
        },
        active,
      },
      take,
      skip,
      orderBy: {
        updatedAt: "desc",
      },
    });
    return roles;
  }
}
