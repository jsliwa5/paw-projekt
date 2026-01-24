import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@UseGuards(AuthGuard, RolesGuard)
@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(Role.Manager)
  create(@Request() req, @Body() createProjectDto: CreateProjectDto) {

    return this.projectsService.create(req.user.sub, createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Delete(':id')
  @Roles(Role.Manager)
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}