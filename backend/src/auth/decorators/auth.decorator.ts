import { Reflector } from "@nestjs/core";
import { AuthType } from "../enums/auth-type.enum";

export const Auth = Reflector.createDecorator<AuthType>();
