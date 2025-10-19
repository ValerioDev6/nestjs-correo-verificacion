import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersEntity } from '../users/entities/user.entity';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { RegisterUserDto } from './dtos/create-user.dto';
import { LoginPersonalDto } from './dtos/login.inteface';
import { AuthService } from './services/auth.service';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente. Se envía un email de validación.',
    schema: {
      example: {
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          first_name: 'Juan',
          last_name: 'Pérez',
          email: 'juan@example.com',
          username: 'juanperez',
          role: 'BASIC',
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o usuario ya existe' })
  register(@Body() createPersonalDto: RegisterUserDto) {
    return this.authService.createPersonal(createPersonalDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      example: {
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'juan@example.com',
          username: 'juanperez',
          role: 'BASIC',
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() loginPersonalDto: LoginPersonalDto) {
    return this.authService.login(loginPersonalDto);
  }

  @Get('check-auth-status')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar estado de autenticación' })
  @ApiResponse({
    status: 200,
    description: 'Token válido, devuelve información del usuario',
    schema: {
      example: {
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'juan@example.com',
          username: 'juanperez',
          role: 'BASIC',
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  checkAuthStatus(@GetUser() user: UsersEntity) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('validate-email/:token')
  @ApiOperation({ summary: 'Validar email del usuario' })
  @ApiParam({
    name: 'token',
    description: 'Token de validación enviado por email',
    example: 'abc123def456',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado de la validación',
    schema: {
      example: {
        success: true,
        message: 'Email validado exitosamente',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token inválido o expirado',
    schema: {
      example: {
        success: false,
        message: 'Error al validar email',
      },
    },
  })
  validateEmail(@Param('token') token: string) {
    const validated = this.authService.validateEmail(token);
    return {
      success: validated,
      message: validated ? 'Email validado exitosamente' : 'Error al validar email',
    };
  }
}
