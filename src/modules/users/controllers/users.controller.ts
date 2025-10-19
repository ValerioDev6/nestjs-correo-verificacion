import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/modules/common/dtos/pagination.dto';
import { CreateUserProjectDto } from '../dto/create-user-project.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatedUserDto } from '../dto/update-user.dto';
import { UsersService } from '../services/users.service';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createPersonal(createUserDto);
  }

  @Post('create-project')
  @ApiOperation({ summary: 'Asignar usuario a un proyecto' })
  @ApiResponse({ status: 201, description: 'Usuario asignado al proyecto exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  registerProject(@Body() createUserProjectDto: CreateUserProjectDto) {
    return this.userService.createUsersProject(createUserProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios con paginación' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.userService.findUserById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdatedUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  delete(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
