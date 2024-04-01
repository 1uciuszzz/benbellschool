import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RoleInDto } from "./dto/role.in.dto";
import { Auth } from "src/auth/decorators/auth.decorator";
import { AuthType } from "src/auth/enums/auth-type.enum";
import { Permissions } from "src/auth/decorators/permissions.decorator";
import { Permission } from "src/shared/enums/permission.enum";
import { RoleUpdateDto } from "./dto/role.update.dto";

@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Auth(AuthType.Bearer)
  @Permissions(Permission.CREATE_ROLE)
  async createRole(@Body() payload: RoleInDto) {
    const role = await this.rolesService.getRoleByName(payload.name);
    if (role) {
      throw new ForbiddenException("Role already exists");
    }
    return this.rolesService.createRole(
      payload.name,
      payload.description,
      payload.active,
    );
  }

  @Delete(":id")
  @Auth(AuthType.Bearer)
  @Permissions(Permission.DELETE_ROLE)
  async deleteRole(@Param("id") id: string) {
    const role = await this.rolesService.getRoleById(id);
    if (!role) {
      throw new NotFoundException("Role not found");
    }
    return this.rolesService.deleteRole(id);
  }

  @Patch(":id")
  @Auth(AuthType.Bearer)
  @Permissions(Permission.UPDATE_ROLE)
  async updateRole(@Param("id") id: string, @Body() payload: RoleUpdateDto) {
    const role = await this.rolesService.getRoleById(id);
    if (!role) {
      throw new NotFoundException("Role not found");
    }
    return this.rolesService.updateRole(
      id,
      payload.name,
      payload.description,
      payload.active,
      payload.userIds,
      payload.permissionIds,
    );
  }

  @Get()
  @Auth(AuthType.Bearer)
  @Permissions(Permission.QUERY_ROLE)
  async getRoles(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("name") name?: string,
    @Query("active") active?: boolean,
  ) {
    page = page || 1;
    limit = limit || 10;
    return this.rolesService.getRoles(page, limit, name, active);
  }
}
