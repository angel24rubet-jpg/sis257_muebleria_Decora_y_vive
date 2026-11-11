import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  MaxLength,
  IsUrl,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ProductoColorDto } from './producto-color.dto';

export class CreateProductoDto {
  // Nombre del producto
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @MaxLength(150)
  nombre: string;

  // Descripcion del producto
  @IsString()
  @IsOptional()
  @MaxLength(500)
  descripcion?: string;

  // Precio de venta
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'El precio debe ser mayor a cero' })
  precio: number;

  // Enlace de la fotografia
  @IsOptional()
  @IsUrl({}, { message: 'La fotografia debe tener un enlace valido' })
  @MaxLength(500)
  fotografia?: string;

  // Identificador de la categoria
  @IsInt()
  @Min(1)
  id_categoria: number;

  // Colores y existencias del producto
  @IsArray()
  @ArrayMinSize(1, {
    message: 'Debe registrar al menos un color',
  })
  @ArrayMaxSize(2, {
    message: 'Solo se permiten dos colores por producto',
  })
  @ValidateNested({ each: true })
  @Type(() => ProductoColorDto)
  colores: ProductoColorDto[];
}