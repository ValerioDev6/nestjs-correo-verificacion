import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ACCESS_LEVEL } from '../../common/constants/roles';
import { ProjectsEntity } from '../../projects/entities/project.entity';
import { UsersEntity } from '../entities/user.entity';

export class CreateUserProjectDto {
  @IsNotEmpty({ message: 'El usuario es requerido' })
  @IsUUID()
  user: UsersEntity;

  @IsNotEmpty({ message: 'El proyecto es requerido' })
  @IsUUID()
  project: ProjectsEntity;

  @IsEnum(ACCESS_LEVEL)
  accessLevel: ACCESS_LEVEL;
}
