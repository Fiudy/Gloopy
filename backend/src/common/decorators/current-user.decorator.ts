import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extrai o userId já validado pelo JwtStrategy (req.user.userId)
 * e injeta diretamente no parâmetro do controller.
 */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  return request.user?.userId;
});
