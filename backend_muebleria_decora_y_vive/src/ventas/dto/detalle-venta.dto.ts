import {
  IsInt,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class DetalleVentaDto {
  // Identificador del producto y color
  @IsInt()
  @Min(1)
  id_producto_color: number;

  // Cantidad de unidades vendidas
  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'La cantidad debe ser minimo de 1' })
  cantidad: number;
}
