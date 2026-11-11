import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(250)
  descripcion?: string;
}
