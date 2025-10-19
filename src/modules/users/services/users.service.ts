import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersEntity } from '../entities/user.entity';

import { HashingService } from '../../../utils/services/hashing.service';
import { ApiException } from '../../common/errors/error';
import { ApiResponse } from '../../common/types/api-response.type';

import { HashingJSService } from '../../../utils/services/bcryptjs.service';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { CreateUserProjectDto } from '../dto/create-user-project.dto';
import { UpdatedUserDto } from '../dto/update-user.dto';
import { UsersProjectsEntity } from '../entities/userProjects.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity) private readonly userRepository: Repository<UsersEntity>,
    @InjectRepository(UsersProjectsEntity) private readonly userProjectRepository: Repository<UsersProjectsEntity>,
    private readonly hashingService: HashingService,
    private readonly hashingJSService: HashingJSService,
  ) {}
  private readonly logger = new Logger('UsersService');

  async createUser(createUserDto: CreateUserDto): Promise<ApiResponse<UsersEntity>> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: [{ email: createUserDto.email }, { username: createUserDto.username }],
      });

      if (existingUser) {
        throw ApiException.Conflict('Usuario ya existe');
      }

      const hashedPassword = await this.hashingService.hash(createUserDto.password);
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const savedUser = await this.userRepository.save(newUser);

      return {
        success: true,
        message: 'Usuario creado exitosamente!',
        data: savedUser,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw ApiException.InternalError('Error al crear usuario');
    }
  }

  async createPersonal(createUserDto: CreateUserDto): Promise<ApiResponse<UsersEntity>> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: [{ email: createUserDto.email }, { username: createUserDto.username }],
      });

      if (existingUser) {
        throw ApiException.Conflict('Usuario ya existe');
      }

      const hashedPassword = await this.hashingJSService.hash(createUserDto.password);

      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const savedUser = await this.userRepository.save(newUser);

      return {
        success: true,
        message: 'Usuario creado exitosamente!',
        data: savedUser,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw ApiException.InternalError('Error al crear usuario');
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<{ info: any; users: UsersEntity[] }> {
    const { page = 1, limit = 5, search = '' } = paginationDto;

    try {
      const [users, total] = await this.userRepository.findAndCount({
        where: [{ username: ILike(`%${search}%`) }, { email: ILike(`%${search}%`) }],
        skip: (page - 1) * limit,
        take: limit,
        order: { username: 'asc' },
      });

      return {
        info: {
          page,
          limit,
          total,
          next: `${process.env.HOST_API}/users?page=${page + 1}&limit=${limit}&search=${search}`,
          prev: page > 1 ? `${process.env.HOST_API}/users?page=${page - 1}&limit=${limit}&search=${search}` : null,
        },
        users,
      };
    } catch (error) {
      throw ApiException.InternalError(`Error al obtener usuarios: ${error}`);
    }
  }

  async findOne(id: string): Promise<ApiResponse<UsersEntity>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id },
      });

      if (!user) {
        throw ApiException.NotFound(`Usuario no encontrado con ID: ${id}`);
      }

      return {
        success: true,
        message: 'Usuario obtenido exitosamente',
        data: user,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw ApiException.InternalError('Error al obtener usuario');
    }
  }

  async findUserById(id: string): Promise<UsersEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: {
          projectsIncludes: {
            project: true,
          },
        },
      });

      if (!user) {
        throw ApiException.NotFound(`Usuario no encontrado con ID: ${id}`);
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw ApiException.InternalError('Error al obtener el usuario');
    }
  }

  async update(id: string, updatedUserDto: UpdatedUserDto): Promise<ApiResponse<UsersEntity>> {
    try {
      await this.findOne(id);

      const updateResult = await this.userRepository.update(id, updatedUserDto);
      if (updateResult.affected === 0) {
        throw ApiException.InternalError('No se pudo actualizar el usuario');
      }

      const updatedUser = await this.userRepository.findOne({ where: { id } });
      return {
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: updatedUser,
      };
    } catch (error) {
      if (error.code === '23505') {
        throw ApiException.Conflict('Email o username ya están en uso');
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw ApiException.InternalError('Error al actualizar usuario');
    }
  }

  async createUsersProject(createUsersProject: CreateUserProjectDto) {
    try {
      return await this.userProjectRepository.save(createUsersProject);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw ApiException.InternalError('Error al crear projecto por usuario');
    }
  }

  async remove(id: string): Promise<ApiResponse<void>> {
    try {
      const deleteResult = await this.userRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw ApiException.NotFound('Usuario no encontrado o ya eliminado');
      }
      return {
        success: true,
        message: 'Usuario eliminado exitosamente!',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw ApiException.InternalError('Error al eliminar usuario');
    }
  }
}
