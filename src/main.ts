import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CORS } from './modules/common/constants';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const configService = app.get(ConfigService);
  app.enableCors(CORS);
  app.setGlobalPrefix('v1/api');

  const config = new DocumentBuilder()
    .setTitle('Mi API - Sistema de Gestión')
    .setDescription('API para gestión de usuarios y proyectos')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Autenticación', 'Endpoints para registro, login y validación')
    .addTag('Usuarios', 'Gestión de usuarios del sistema')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  const port = configService.get('PORT') || 3000;

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/v1/api/api/docs`);
}
bootstrap();
