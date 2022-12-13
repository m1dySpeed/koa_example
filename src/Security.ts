import { User } from './entities/User/User.entity';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export interface SecurityConstructorParams {
  jwtInstance: any;
  bcryptInstance: any;
  jwtSecret: string;
  tokenExpiration: string;
}

export interface TokenData {
  id: string;
  username: string;
  email: string;
}
export class Security {
  private jwtSecret: string;
  private tokenExpiration: string;
  private jwt: typeof jwt;
  private bcrypt: typeof bcrypt;
  constructor(secret: SecurityConstructorParams) {
    const { jwtSecret, tokenExpiration, jwtInstance, bcryptInstance } = secret;

    this.jwtSecret = jwtSecret;
    this.tokenExpiration = tokenExpiration;
    this.jwt = jwtInstance;
    this.bcrypt = bcryptInstance;
  }

  signToken(user: User) {
    const { id, username, email } = user;

    return this.jwt.sign(
      {
        id,
        username,
        email,
      },
      this.jwtSecret,
      { expiresIn: this.tokenExpiration }
    );
  }
  verifyToken(token: string) {
    return this.jwt.verify(token, this.jwtSecret);
  }
  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  comparePasswords(passwords: { password: string; dbHash: string }) {
    const { password, dbHash } = passwords;

    return bcrypt.compare(password, dbHash);
  }
}
