import {
  IsInt,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';
import { DetalleVentaDto } from './detalle-venta.dto';

export class CreateVentaDto {
  // Identificador del cliente
  @IsInt()
  @Min(1)
  id_cliente: number;

  // Descuento de la venta
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  descuento?: number;

  // Productos incluidos en la venta
  @IsArray()
  @ArrayMinSize(1, {
    message: 'La venta debe tener al menos un producto',
  })
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  detalles: DetalleVentaDto[];
}
