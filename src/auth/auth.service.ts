import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../module/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../module/user/dto/create-user.dto';
import { Role, User } from '@prisma/client';
import { UserToken } from './models/UserToken';
import { UnauthorizedError } from './errors/unauthorized.error';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User): Promise<UserToken> {
    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.getUserByEmail(email);

    if (user) {
      const isPasswordIsValid = await bcrypt.compare(password, user.password);

      if (isPasswordIsValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    throw new UnauthorizedError(
      'Email address or password provided is incorrect.',
    );
  }

  async register(createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}