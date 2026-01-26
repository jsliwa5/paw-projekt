import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private readonly taskSelect = {
    id: true,
    title: true,
    description: true,
    status: true,
    priority: true,
    dueDate: true,
    projectId: true,
    userId: true,

    assignedTo: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  };

  async create(createTaskDto: CreateTaskDto) {
    const proj = await this.prisma.project.findUnique({
      where: { id: createTaskDto.projectId },
    });

    if (!proj) {
      throw new NotFoundException(`Project with ID ${createTaskDto.projectId} not found`);
    }

    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        projectId: createTaskDto.projectId,
        userId: createTaskDto.userId || null,
        status: 'TODO',
        priority: createTaskDto.priority,
        dueDate: createTaskDto.dueDate,
      },
      select: this.taskSelect,
    });
  }

  findAll(projectId?: number, status?: string) {
    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    return this.prisma.task.findMany({
      where,
      select: this.taskSelect,
    });
  }

  async assignUser(taskId: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: { userId },
      select: this.taskSelect,
    });
  }

  async updateStatus(taskId: number, status: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const validStatuses = Object.values(TaskStatuses) as string[];

    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Status not allowed! Possible statuses: ${validStatuses.join(', ')}`);
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: { status },
      select: this.taskSelect,
    });
  }
}

enum TaskStatuses {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED',
}