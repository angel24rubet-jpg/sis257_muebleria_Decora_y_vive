import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePagoPedidoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  comprobante: string;
}