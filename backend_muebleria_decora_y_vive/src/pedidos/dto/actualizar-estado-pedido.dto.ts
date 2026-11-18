import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class ActualizarEstadoPedidoDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(["CONFIRMADO", "EN_PROCESO", "ENVIADO", "ENTREGADO", "CANCELADO"])
  estado_pedido: string;
}
