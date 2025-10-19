import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginPersonalDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@example.com',
    format: 'email',
  })
  @IsString()
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Password123!',
    format: 'password',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
