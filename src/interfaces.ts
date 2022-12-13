import { Connection } from 'typeorm';
import { Security } from './Security';

export interface InjectionParas {
  connection: Connection;
  security: Security;
}
