import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * this decorator let us to know the current user
 */
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(request.session.userId);
    return request.currentUser;
  },
);
