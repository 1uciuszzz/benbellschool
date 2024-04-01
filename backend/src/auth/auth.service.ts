import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { BcryptService } from "src/bcrypt.service";
import { PrismaService } from "src/prisma.service";
import JwtConfig from "./config/jwt.config";
import { Gender } from "@prisma/client";
import { Permission } from "src/shared/enums/permission.enum";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcrypt: BcryptService,
    private readonly jwtService: JwtService,
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
  ) {}

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfig.audience,
        issuer: this.jwtConfig.issuer,
        secret: this.jwtConfig.secret,
        expiresIn,
      },
    );
  }

  async getUserByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    return user;
  }

  async signUp(
    username: string,
    password: string,
    name: string,
    gender: Gender,
    icNumber: string,
    email: string,
    phone: string,
  ) {
    password = await this.bcrypt.hash(password);
    const user = await this.prisma.user.create({
      data: {
        username,
        password,
        name,
        gender,
        icNumber,
        email,
        phone,
      },
    });
    return user;
  }

  async signIn(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        role: true,
      },
    });
    const match = await this.bcrypt.compare(password, user.password);
    return match ? user : null;
  }

  async generateToken(id: string, roleId: string) {
    const token = await this.signToken<{ roleId: string }>(
      id,
      this.jwtConfig.accessTokenTtl,
      { roleId },
    );
    return `Bearer ${token}`;
  }

  async checkPermissions(roleId: string, permissionName: Permission) {
    const permission = await this.prisma.permission.findUnique({
      where: { name: permissionName },
    });
    const target = await this.prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          permissionId: permission.id,
          roleId,
        },
      },
    });
    return !!target;
  }

  async getUserInfo(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const permissions = await this.prisma.permission.findMany({
      include: {
        roles: true,
      },
      where: {
        roles: {
          some: {
            roleId: user.roleId,
          },
        },
      },
    });
    user.password = undefined;
    return { ...user, permissions: permissions.map((p) => p.name) };
  }
}
