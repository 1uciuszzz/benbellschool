import { Reflector } from "@nestjs/core";
import { Permission } from "src/shared/enums/permission.enum";

export const Permissions = Reflector.createDecorator<Permission>();
