import { IsOptional, IsString, MaxLength } from "class-validator";

export class CancelarPedidoDto {
  @IsOptional()
  @IsString()
  @MaxLength(250)
  observacion?: string;
}
