import { Injectable } from '@nestjs/common';

// 1. Definiujemy, jak wygląda nasz zmockowany User
// Musimy dodać 'export', bo będziesz tego typu używał w AuthService
export type User = {
  userId: number;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  // 2. Tutaj używamy typu User[]
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  // 3. Teraz TypeScript wie, co to jest 'User'
  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}