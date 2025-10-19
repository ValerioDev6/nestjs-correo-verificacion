import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashingJSService } from '../../utils/services/bcryptjs.service';
import { UsersEntity } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { EmailService } from './services/email.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule,
    // ❌ ELIMINA ESTA LÍNEA: JwtModule,  ← Este está vacío y causa el problema
    TypeOrmModule.forFeature([UsersEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '1h',
          },
        };
      },
    }),
  ],
  providers: [AuthService, HashingJSService, JwtStrategy, EmailService],
  exports: [PassportModule, JwtModule, EmailService],
})
export class AuthModule {}
