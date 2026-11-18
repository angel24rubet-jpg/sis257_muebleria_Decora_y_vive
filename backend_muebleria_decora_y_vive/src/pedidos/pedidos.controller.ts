import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  ForbiddenException,
} from "@nestjs/common";

import { PedidosService } from "./pedidos.service";
import { CreatePedidoDto } from "./dto/create-pedido.dto";

import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles/roles.guard";
import { CreatePagoPedidoDto } from "./dto/create-pago-pedido.dto";
import { VerificarPagoDto } from "./dto/verificar-pago.dto";
import { CancelarPedidoDto } from "./dto/cancelar-pedido.dto";
import { Roles } from "../auth/decorators/roles.decorator";
import { ActualizarEstadoPedidoDto } from "./dto/actualizar-estado-pedido.dto";

@Controller("pedidos")
@UseGuards(JwtAuthGuard, RolesGuard)
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  // Crear pedido: cliente autenticado
  @Post()
  crear(@Body() dto: CreatePedidoDto, @Req() req: any) {
    return this.pedidosService.crear(req.user.id_usuario, dto);
  }

  // Listar pedidos: administrador ve todos, cliente solo los suyos
  @Get()
  listar(@Req() req: any) {
    if (req.user.rol === "ADMINISTRADOR") {
      return this.pedidosService.listarTodos();
    }

    return this.pedidosService.listarPorUsuario(req.user.id_usuario);
  }

  // Buscar pedido por ID
  @Get(":id")
  async buscarPorId(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    const pedido = await this.pedidosService.buscarPorId(id);

    if (
      req.user.rol !== "ADMINISTRADOR" &&
      pedido.usuario.id_usuario !== req.user.id_usuario
    ) {
      throw new ForbiddenException(
        "No tienes permiso para consultar este pedido",
      );
    }

    return pedido;
  }
  // Registrar comprobante de pago
  @Patch(":id/comprobante")
  registrarComprobante(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CreatePagoPedidoDto,
    @Req() req: any,
  ) {
    return this.pedidosService.registrarComprobante(
      id,
      req.user.id_usuario,
      dto,
    );
  }

  // Verificar pago: solo administrador
  @Patch("pagos/:id/verificar")
  @Roles("ADMINISTRADOR")
  verificarPago(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: VerificarPagoDto,
  ) {
    return this.pedidosService.verificarPago(id, dto);
  }

  // Cancelar pedido: cliente propietario o administrador
  @Patch(":id/cancelar")
  cancelarPedido(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CancelarPedidoDto,
    @Req() req: any,
  ) {
    return this.pedidosService.cancelarPedido(
      id,
      req.user.id_usuario,
      dto,
      req.user.rol === "ADMINISTRADOR",
    );
  }

  // Actualizar estado: solo administrador
  @Patch(":id/estado")
  @Roles("ADMINISTRADOR")
  actualizarEstado(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: ActualizarEstadoPedidoDto,
  ) {
    return this.pedidosService.actualizarEstado(id, dto);
  }
}
