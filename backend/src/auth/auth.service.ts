import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}


  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    // 1. Znajdź usera w bazie
    const user = await this.usersService.findOne(email);
    
    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }


  async signUp(email: string, pass: string, name?: string) {
    
    const existingUser = await this.usersService.findOne(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
    });


    return { 
      msg: 'User created successfully', 
      userId: newUser.id 
    };
  }
}