import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import { createConnection } from 'typeorm';
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
  HTTP_PORT,
  JWT_SECRET,
  TOKEN_EXP,
} from './config';
import Logger from './logger';
import { Security } from './Security';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { asValue, createContainer } from 'awilix';
import { scopePerRequest, loadControllers } from 'awilix-koa';

export async function databaseConnection() {
  try {
    return await createConnection({
      type: 'postgres',
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      username: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      entities: [__dirname + '/entities/*/*.entity.{ts,js}'],
    });
  } catch (error) {
    Logger.error('databaseConnection_error', error);
  }
}
export async function createApp() {
  const app = new Koa();

  const connection = await databaseConnection();

  if (!connection) {
    throw app.context.throw('createApp_error[connection]');
  }

  const security = new Security({
    jwtInstance: jwt,
    bcryptInstance: bcrypt,
    jwtSecret: JWT_SECRET,
    tokenExpiration: TOKEN_EXP,
  });

  const securityContainer = createContainer().register({
    security: asValue(security),
    connection: asValue(connection),
  });

  app
    .use(bodyParser())
    .use(cors())
    .use(scopePerRequest(securityContainer))
    .use(
      loadControllers('entities/*/*.controller.{ts,js}', { cwd: __dirname })
    );

  return app;
}

async function startServer() {
  try {
    const app = await createApp();

    app.listen(HTTP_PORT);
    Logger.info(`Server started, port: ${HTTP_PORT}`);
  } catch (error) {
    Logger.error('startServer_error', error);
  }
}

startServer();
