import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma.module'; // <--- Import
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    PrismaModule, 
    UsersModule, 
    AuthModule, ProjectsModule, TasksModule
  ],
  controllers: [AppController],
  providers: [AppService], 
  
})
export class AppModule {}