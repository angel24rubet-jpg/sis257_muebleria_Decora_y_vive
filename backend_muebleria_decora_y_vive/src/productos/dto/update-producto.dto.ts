import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';

// Permite actualizar los datos del producto
export class UpdateProductoDto extends PartialType(CreateProductoDto) {}