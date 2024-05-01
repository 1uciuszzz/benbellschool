import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";
import JwtConfig from "./config/jwt.config";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
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
        secret: this.jwtConfig.secret,
        expiresIn,
      },
    );
  }

  async getUserByName(name: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        name,
      },
    });
    return user;
  }

  async signUp(name: string) {
    const user = await this.prisma.user.create({
      data: {
        name,
      },
    });
    return user;
  }

  async signIn(name: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        name,
      },
    });
    return user;
  }

  async generateToken(id: string, name: string) {
    const token = await this.signToken<{ name: string }>(
      id,
      this.jwtConfig.accessTokenTtl,
      { name },
    );
    return `Bearer ${token}`;
  }

  async getUserInfo(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }
}

