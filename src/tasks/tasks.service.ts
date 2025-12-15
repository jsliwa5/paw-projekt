import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}


  create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        projectId: createTaskDto.projectId,
        userId: createTaskDto.userId || null, // Może być null
        status: 'TODO',
      },
    });
  }

  findAll(projectId?: number, status?: string) {
    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    return this.prisma.task.findMany({
      where,
      include: { assignedTo: true },
    });
  }

  assignUser(taskId: number, userId: number) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: { userId },
    });
  }

  updateStatus(taskId: number, status: string) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
  }
}