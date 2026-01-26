import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}


  async signIn(email: string, pass: string): Promise<{ access_token: string, role: string }> {
    const user = await this.usersService.findOne(email);
    
    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      role: user.role,
    };
  }


  async signUp(email: string, pass: string, role: Role, name?: string) {
    
    const existingUser = await this.usersService.findOne(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
      role,
    });


    return { 
      msg: 'User created successfully', 
      userId: newUser.id 
    };
  }
}