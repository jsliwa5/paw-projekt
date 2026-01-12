import { BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
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
        userId: createTaskDto.userId || null, 
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

  async assignUser(taskId: number, userId: number) {
    
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: { userId },
    });
  }

  updateStatus(taskId: number, status: string) {

    const validStatuses = Object.values(TaskStatuses) as string[];

    if (!validStatuses.includes(status)){
      throw new BadRequestException(`Status not allowed! Possible statuses: ${validStatuses.join(', ')}`);
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
  }
}

enum TaskStatuses {
  TODO,
  IN_PROGRESS,
  PAUSED,
  FINISHED,
}