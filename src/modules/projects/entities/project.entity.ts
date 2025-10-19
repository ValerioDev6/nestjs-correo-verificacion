import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../config/base.entity';
import { IProject } from '../../common/interfaces/project.interface';
import { UsersProjectsEntity } from '../../users/entities/userProjects.entity';
@Entity({ name: 'projects' })
export class ProjectsEntity extends BaseEntity implements IProject {
  @Column()
  name: string;
  @Column()
  descripcion: string;

  @OneToMany(() => UsersProjectsEntity, (userProjects) => userProjects.project)
  usersIncludes: UsersProjectsEntity[];
}
