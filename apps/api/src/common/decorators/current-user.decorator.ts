import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '@eotc/contracts';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDto | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
