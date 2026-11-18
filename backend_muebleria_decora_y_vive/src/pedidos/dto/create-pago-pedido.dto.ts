
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreatePagoPedidoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre_pagador: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  comprobante: string;
}
