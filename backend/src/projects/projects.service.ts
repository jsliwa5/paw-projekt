import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // Tworzenie projektu (przypisanego do właściciela)
  create(userId: number, createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        ownerId: userId,
      },
    });
  }

  
  findAll() {
    return this.prisma.project.findMany({
      include: {
        tasks: true, 
      },
    });
  }

  // Pobranie jednego projektu
  findOne(id: number) {
    return this.prisma.project.findUnique({ where: { id } });
  }

  // Usuwanie projektu
  remove(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }
}