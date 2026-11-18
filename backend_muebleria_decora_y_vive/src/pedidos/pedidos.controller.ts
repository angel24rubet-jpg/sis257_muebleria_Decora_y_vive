import {
  Controller,
  Get,
  Post,
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
}
