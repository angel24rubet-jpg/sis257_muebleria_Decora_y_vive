import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categoria.dto';

// Permite actualizar los campos de una categoria
export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {}
