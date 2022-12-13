import { Context } from 'koa';
import { UNAUTHORIZED } from 'http-status-codes';
import { TokenData } from '../Security';
import { UserRepository } from '../entities/User/User.entity';
import { InjectionParas } from '../interfaces';

export default function authMiddleware(
  params: InjectionParas,
  authRequired = true
) {
  return async function (ctx: Context, next) {
    const { authorization } = ctx.header;
    const { security, connection } = params;

    if (!authRequired) {
      return next();
    }

    if (authRequired && !authorization) {
      ctx.throw(UNAUTHORIZED);
    }

    const [type, token] = (authorization as string).split(' ');

    if (type !== 'Bearer') {
      ctx.throw(UNAUTHORIZED);
    }

    let tokenData: TokenData;

    try {
      tokenData = security.verifyToken(token) as TokenData;
    } catch (error) {
      ctx.throw(UNAUTHORIZED);
    }

    if (!tokenData) {
      ctx.throw(UNAUTHORIZED);
    }

    const user = connection
      .getCustomRepository(UserRepository)
      .findOne(tokenData.id);

    if (!user) {
      ctx.throw(UNAUTHORIZED);
    }

    ctx.state.user = user;
    ctx.state.token = token;

    return next();
  };
}
