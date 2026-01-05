import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}


  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(
    @Query('projectId') projectId?: string,
    @Query('status') status?: string,
  ) {
    return this.tasksService.findAll(
      projectId ? +projectId : undefined, 
      status
    );
  }

 
  @Patch(':id/assign')
  assignUser(@Param('id') id: string, @Body('userId') userId: number) {
    return this.tasksService.assignUser(+id, userId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.tasksService.updateStatus(+id, status);
  }
}