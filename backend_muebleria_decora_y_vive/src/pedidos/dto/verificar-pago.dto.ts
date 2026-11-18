import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class VerificarPagoDto {
  @IsIn(["PAGADO", "RECHAZADO"])
  estado_pago: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  observacion?: string;
}
