import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ROLES } from '../../common/constants/roles';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser un texto' })
  first_name: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @IsString({ message: 'El apellido debe ser un texto' })
  last_name: string;

  @ApiProperty({
    description: 'Edad del usuario',
    example: 25,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'El campo edad es requerido' })
  @IsNumber({}, { message: 'La edad debe ser un número' })
  age: number;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@example.com',
  })
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsString({ message: 'El email debe ser un texto' })
  email: string;

  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'juanperez',
  })
  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  @IsString({ message: 'El nombre de usuario debe ser un texto' })
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Password123!',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser un texto' })
  password: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    enum: ROLES,
    default: ROLES.BASIC,
    example: ROLES.BASIC,
  })
  @IsNotEmpty()
  @IsEnum(ROLES, { message: 'El rol debe ser BASIC, ADMIN' })
  role: ROLES = ROLES.BASIC;
}
