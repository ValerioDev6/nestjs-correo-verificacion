import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadToken } from '../interfaces/payload-token.inteface';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: PayloadToken) {
    const { id } = payload;

    const user = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new UnauthorizedException('Token no válido');
    }

    // Asumiendo que tienes una columna de estado en tu entidad
    // Si no la tienes, puedes remover esta validación
    // if (!user.status) {
    //   throw new UnauthorizedException('Usuario inactivo, contacte al administrador');
    // }

    return user;
  }
}
