import { before, GET, inject, POST, route } from 'awilix-koa';
import { InjectionParas } from '../../interfaces';
import { Repository } from 'typeorm';
import { User, UserPost, UserRepository } from './User.entity';
import { Security } from '../../Security';
import { Context } from 'koa';
import { assign, omit } from 'lodash';
import { CREATED, NOT_FOUND, OK } from 'http-status-codes';
import authMiddleware from '../../middleware/authMidleware';

@route('/users')
export default class UserController {
  private userRepo: Repository<User>;
  private security: Security;
  constructor(params: InjectionParas) {
    const { connection, security } = params;

    this.userRepo = connection.getCustomRepository(UserRepository);
    this.security = security;
  }
  @route('/register')
  @POST()
  async createUser(ctx: Context) {
    const body: UserPost = ctx.request.body as UserPost;

    body.password = await this.security.hashPassword(body.password);

    const newUser = new User();

    assign(newUser, body);

    const userData = await this.userRepo.save(newUser);

    const accessToken = this.security.signToken(userData);

    ctx.body = { user: omit(userData, 'password'), accessToken };
    ctx.status = CREATED;
  }

  @route('/:id')
  @GET()
  @before(inject(authMiddleware))
  async getUser(ctx: Context) {
    const splittedPath = ctx.request.path.split('/');
    const id = splittedPath[splittedPath.length - 1];

    const user = this.userRepo.findOne(id);

    if (!user) {
      ctx.throw(NOT_FOUND);
    }

    ctx.body = omit(user, 'password');
    ctx.status = OK;
  }
}
