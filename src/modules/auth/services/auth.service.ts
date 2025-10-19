/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingJSService } from '../../../utils/services/bcryptjs.service';
import { ApiException } from '../../common/errors/error';
import { UsersEntity } from '../../users/entities/user.entity';
import { RegisterUserDto } from '../dtos/create-user.dto';
import { LoginPersonalDto } from '../dtos/login.inteface';
import { PayloadToken } from '../interfaces/payload-token.inteface';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity) private readonly userRepository: Repository<UsersEntity>,
    private readonly jwtService: JwtService,
    private readonly hashingJSService: HashingJSService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async createPersonal(createUserDto: RegisterUserDto): Promise<{ user: UsersEntity; access_token: string }> {
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

      // Enviamos el correo con el email y la contraseña original (no la hasheada)
      await this.sendEmailValidationLinks(savedUser.email, createUserDto.password);

      const payload: PayloadToken = { id: savedUser.id };
      const token = await this.generateJWT(payload);

      return { user: savedUser, access_token: token };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw ApiException.InternalError('Error al crear usuario');
    }
  }

  async login(loginDto: LoginPersonalDto) {
    const { email, password } = loginDto;

    const personal = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!personal) {
      throw ApiException.Unauthorized('Email inválido, verifique su correo');
    }

    const isPasswordValid = await this.hashingJSService.compare(password, personal.password);

    if (!isPasswordValid) {
      throw ApiException.Unauthorized('Contraseña incorrecta, inténtelo de nuevo');
    }

    const payload: PayloadToken = { id: personal.id };
    const token = await this.generateJWT(payload);
    // this.sendEmailValidationLink(personal.email);

    return {
      success: true,
      message: 'Login exitoso',
      data: {
        user: personal,
        access_token: token,
      },
    };
  }

  async checkAuthStatus(user: UsersEntity) {
    const personal = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!personal) {
      throw ApiException.Unauthorized('Usuario no encontrado');
    }

    const payload: PayloadToken = { id: user.id };
    const token = await this.generateJWT(payload);

    return {
      success: true,
      message: 'Token renovado exitosamente',
      data: {
        user: personal,
        access_token: token,
      },
    };
  }

  private generateJWT(payload: PayloadToken) {
    return this.jwtService.sign(payload);
  }

  private async sendEmailValidationLink(email: string): Promise<boolean> {
    const payload = { email };

    const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const validationUrl = `${this.configService.get<string>('HOST_API')}/auth/validate-email/${token}`;

    const htmlBody = `
        <h1>Valida tu correo electrónico</h1>
        <p>Haz clic en el siguiente enlace para validar tu correo:</p>
        <a href="${validationUrl}">Validar correo electrónico</a>
      `;

    const options = {
      to: email,
      subject: 'Validación de correo electrónico',
      htmlBody,
    };

    const sent = await this.emailService.sendEmail(options);
    if (!sent) {
      throw ApiException.InternalError('Error al enviar el correo de validacion');
    }

    return true;
  }

  private async sendEmailValidationLinks(email: string, password: string): Promise<boolean> {
    const payload = { email };

    const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const validationUrl = `${this.configService.get<string>('HOST_API')}/auth/validate-email/${token}`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Bienvenido a nuestra plataforma</h1>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #444;">Tus credenciales de acceso:</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Contraseña:</strong> ${password}</p>
          <p style="color: #666;">Por favor, guarda esta información en un lugar seguro.</p>
        </div>

        <div style="margin: 20px 0;">
          <h2 style="color: #444;">Validación de correo electrónico</h2>
          <p>Para completar tu registro, por favor haz clic en el siguiente enlace:</p>
          <a href="${validationUrl}"
             style="display: inline-block;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;">
            Validar mi correo electrónico
          </a>
        </div>

        <p style="color: #666; font-size: 0.9em;">
          Este enlace expirará en 1 hora. Si no realizaste este registro,
          por favor ignora este correo.
        </p>
      </div>
    `;

    const options = {
      to: email,
      subject: 'Bienvenido - Validación de correo electrónico',
      htmlBody,
    };

    const sent = await this.emailService.sendEmail(options);
    if (!sent) {
      throw ApiException.InternalError('Error al enviar el correo de validacion');
    }

    return true;
  }

  async validateEmail(token: string): Promise<boolean> {
    try {
      const payload = this.jwtService.verify(token);
      const { email } = payload;

      const user = await this.userRepository.findOne({
        where: { email },
      });
      if (!user) {
        throw ApiException.BadRequest('Usuario no encontrado');
      }

      await this.userRepository.update({ email }, { email_validated: true });

      return true;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw ApiException.Unauthorized('Token inválido');
      }
      throw ApiException.InternalError('Error al validar el email');
    }
  }
}
