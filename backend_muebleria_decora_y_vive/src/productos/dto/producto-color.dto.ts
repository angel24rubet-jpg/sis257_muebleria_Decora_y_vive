import {
  IsInt,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class ProductoColorDto {
  // Identificador del color
  @IsInt()
  @Min(1)
  id_color: number;

  // Cantidad disponible
  @IsInt()
  @Min(1, { message: "El stock debe ser minimo de 1 unidad" })
  stock: number;
}

export class AsignarColoresDto {
  // Colores disponibles para el producto
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => ProductoColorDto)
  colores: ProductoColorDto[];
}
