import {
  IsString,
  IsNotEmpty,
  IsIn,
} from 'class-validator';

export class UpdateVentaDto {
  // Estado de la venta
  @IsString()
  @IsNotEmpty()
  @IsIn(['COMPLETADA', 'ANULADA'], {
    message: 'El estado debe ser COMPLETADA o ANULADA',
  })
  estado: string;
}
