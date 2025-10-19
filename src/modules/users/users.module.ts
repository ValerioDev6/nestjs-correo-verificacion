import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/user.entity';
import { BcryptService } from '../../utils/services/bcrypt.service';
import { UsersProjectsEntity } from './entities/userProjects.entity';
import { HashingService } from '../../utils/services/hashing.service';
import { HashingJSService } from 'src/utils/services/bcryptjs.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, UsersProjectsEntity])],
  providers: [
    UsersService,
    HashingJSService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
