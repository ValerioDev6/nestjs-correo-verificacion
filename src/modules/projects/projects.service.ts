import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiException } from '../common/errors/error';
import { ApiResponse } from '../common/types/api-response.type';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsEntity } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(ProjectsEntity) private readonly projectRepository: Repository<ProjectsEntity>) {}

  async create(createProjectDto: CreateProjectDto): Promise<ApiResponse<ProjectsEntity>> {
    try {
      const newProject = await this.projectRepository.create({
        ...createProjectDto,
      });

      const project = await this.projectRepository.save(newProject);

      return {
        success: true,
        message: 'Projecto Creado exitosament',
        data: project,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw ApiException.InternalError('Error al crear projecto');
    }
  }

  findAll() {
    return `This action returns all projects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
