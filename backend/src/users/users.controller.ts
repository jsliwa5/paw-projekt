import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //@UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll(); 
  }

  @Get(':email')
  findOne(@Param('email') email : string ){
    return this.usersService.findOne(email);
  }

}