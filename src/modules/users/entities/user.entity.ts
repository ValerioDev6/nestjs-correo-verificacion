import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../config/base.entity';
import { ROLES } from '../../common/constants/roles';
import { IUser } from '../../common/interfaces/user.interface';
import { UsersProjectsEntity } from './userProjects.entity';

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity implements IUser {
  @Column()
  first_name: string;
  @Column()
  last_name: string;
  @Column()
  age: number;
  @Column({ unique: true })
  email: string;
  @Column({ unique: true })
  username: string;
  @Exclude()
  @Column()
  password: string;
  @Column({ type: 'enum', enum: ROLES })
  role: ROLES;
  @Column({ default: false })
  email_validated: boolean;

  @OneToMany(() => UsersProjectsEntity, (userProjects) => userProjects.user)
  projectsIncludes: UsersProjectsEntity[];
}
