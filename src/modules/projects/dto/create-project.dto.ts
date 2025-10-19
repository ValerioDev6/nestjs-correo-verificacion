import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser un texto' })
  name: string;

  @IsNotEmpty({ message: 'La descripcion es  requerida' })
  @IsString({ message: 'La descripcion  debe ser un texto' })
  descripcion: string;
}
