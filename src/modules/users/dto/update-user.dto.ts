import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ROLES } from '../../common/constants/roles';

export class UpdatedUserDto {
  @ApiPropertyOptional({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsOptional()
  @IsString()
  first_name: string;

  @ApiPropertyOptional({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  @IsOptional()
  @IsString()
  last_name: string;

  @ApiPropertyOptional({
    description: 'Edad del usuario',
    example: 25,
  })
  @IsOptional()
  @IsNumber()
  age: number;

  @ApiPropertyOptional({
    description: 'Email del usuario',
    example: 'juan.perez@example.com',
  })
  @IsOptional()
  @IsString()
  email: string;

  @ApiPropertyOptional({
    description: 'Nombre de usuario',
    example: 'juanperez',
  })
  @IsOptional()
  @IsString()
  username: string;

  @ApiPropertyOptional({
    description: 'Nueva contraseña',
    example: 'NewPassword123!',
  })
  @IsOptional()
  @IsString()
  password: string;

  @ApiPropertyOptional({
    description: 'Rol del usuario',
    enum: ROLES,
    example: ROLES.BASIC,
  })
  @IsOptional()
  @IsEnum(ROLES)
  role: ROLES;
}
