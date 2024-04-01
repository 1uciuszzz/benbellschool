import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { TokenPayload } from "../entities/token-payload.entity";

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as TokenPayload;
  },
);
