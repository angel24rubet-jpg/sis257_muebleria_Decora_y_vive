import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";

import { Pedido } from "./entities/pedido.entity";
import { DetallePedido } from "./entities/detalle-pedido.entity";
import { PagoPedido } from "./entities/pago-pedido.entity";
import { ProductoColor } from "../productos/entities/producto-color.entity";
import { CreatePedidoDto } from "./dto/create-pedido.dto";
import { CreatePagoPedidoDto } from "./dto/create-pago-pedido.dto";
import { VerificarPagoDto } from "./dto/verificar-pago.dto";
import { CancelarPedidoDto } from "./dto/cancelar-pedido.dto";
import { ActualizarEstadoPedidoDto } from "./dto/actualizar-estado-pedido.dto";

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,

    private dataSource: DataSource,
  ) {}

  async crear(id_usuario: number, dto: CreatePedidoDto) {
    if (!dto.detalles?.length) {
      throw new BadRequestException("El pedido debe contener productos");
    }

    return this.dataSource.transaction(async (manager) => {
      const detallesPedido = [];
      let subtotal = 0;

      for (const detalle of dto.detalles) {
        const productoColor = await manager
          .createQueryBuilder(ProductoColor, "pc")
          .setLock("pessimistic_write", undefined, ["pc"])
          .leftJoinAndSelect("pc.producto", "producto")
          .leftJoinAndSelect("pc.color", "color")
          .where("pc.id_producto_color = :id", {
            id: detalle.id_producto_color,
          })
          .getOne();

        if (!productoColor) {
          throw new NotFoundException("Producto o color no encontrado");
        }

        if (productoColor.stock < detalle.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para el producto ${productoColor.producto.nombre}`,
          );
        }

        const precio = Number(productoColor.producto.precio);

        if (!Number.isFinite(precio) || precio < 0) {
          throw new BadRequestException("Precio de producto no válido");
        }

        const importe = precio * detalle.cantidad;
        subtotal += importe;

        productoColor.stock -= detalle.cantidad;
        await manager.save(productoColor);

        detallesPedido.push({
          productoColor,
          cantidad: detalle.cantidad,
          precio_unitario: precio,
          subtotal: importe,
        });
      }

      const pedido = manager.create(Pedido, {
        usuario: { id_usuario } as any,
        numero_pedido: `PED-${Date.now()}`,
        subtotal,
        descuento: 0,
        total: subtotal,
        direccion_entrega: dto.direccion_entrega,
        estado_pedido: "PENDIENTE",
        estado_pago: "PENDIENTE",
      });

      const pedidoGuardado = await manager.save(pedido);

      const detalles = detallesPedido.map((detalle) =>
        manager.create(DetallePedido, {
          pedido: pedidoGuardado,
          ...detalle,
        }),
      );

      await manager.save(detalles);

      const pago = manager.create(PagoPedido, {
        pedido: pedidoGuardado,
        estado_pago: "PENDIENTE",
      });

      await manager.save(pago);

      return manager.findOne(Pedido, {
        where: { id_pedido: pedidoGuardado.id_pedido },
        relations: {
          usuario: true,
          detalles: {
            productoColor: true,
          },
          pagos: true,
        },
      });
    });
  }

  async listarTodos() {
    return this.pedidoRepository.find({
      relations: {
        usuario: true,
        detalles: {
          productoColor: {
            producto: true,
            color: true,
          },
        },
        pagos: true,
      },
      order: { fecha_pedido: "DESC" },
    });
  }

  async listarPorUsuario(id_usuario: number) {
    return this.pedidoRepository.find({
      where: { usuario: { id_usuario } },
      relations: {
        detalles: {
          productoColor: {
            producto: true,
            color: true,
          },
        },
        pagos: true,
      },
      order: { fecha_pedido: "DESC" },
    });
  }

  async buscarPorId(id_pedido: number) {
    const pedido = await this.pedidoRepository.findOne({
      where: { id_pedido },
      relations: {
        usuario: true,
        detalles: {
          productoColor: {
            producto: true,
            color: true,
          },
        },
        pagos: true,
      },
    });

    if (!pedido) {
      throw new NotFoundException("Pedido no encontrado");
    }

    return pedido;
  }

  async registrarComprobante(
    id_pedido: number,
    id_usuario: number,
    dto: CreatePagoPedidoDto,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const pedido = await manager
        .createQueryBuilder(Pedido, "pedido")
        .setLock("pessimistic_write", undefined, ["pedido"])
        .where("pedido.id_pedido = :id_pedido", { id_pedido })
        .andWhere("pedido.id_usuario = :id_usuario", { id_usuario })
        .getOne();

      if (!pedido) {
        throw new NotFoundException("Pedido no encontrado");
      }

      pedido.pagos = await manager.find(PagoPedido, {
        where: {
          pedido: { id_pedido: pedido.id_pedido },
        },
      });

      if (pedido.estado_pago === "PAGADO") {
        throw new BadRequestException("Este pedido ya está pagado");
      }

      const pagoRechazado = pedido.pagos.find(
        (pago) => pago.estado_pago === "RECHAZADO",
      );

      if (pagoRechazado) {
        pagoRechazado.nombre_pagador = dto.nombre_pagador;
        pagoRechazado.comprobante = dto.comprobante;
        pagoRechazado.estado_pago = "EN_REVISION";
        pagoRechazado.observacion = "";

        pedido.estado_pago = "EN_REVISION";

        await manager.save(PagoPedido, pagoRechazado);
        await manager.save(Pedido, pedido);

        return pagoRechazado;
      }

      const pagoPendiente = pedido.pagos.find(
        (pago) => pago.estado_pago === "PENDIENTE",
      );

      if (!pagoPendiente) {
        throw new BadRequestException(
          "No existe un pago pendiente para este pedido",
        );
      }

      pagoPendiente.nombre_pagador = dto.nombre_pagador;
      pagoPendiente.comprobante = dto.comprobante;
      pagoPendiente.estado_pago = "EN_REVISION";
      pedido.estado_pago = "EN_REVISION";

      await manager.save(PagoPedido, pagoPendiente);
      await manager.save(Pedido, pedido);

      return pagoPendiente;
    });
  }

  async verificarPago(id_pago_pedido: number, dto: VerificarPagoDto) {
    return this.dataSource.transaction(async (manager) => {
      const pago = await manager.findOne(PagoPedido, {
        where: { id_pago_pedido },
        relations: {
          pedido: true,
        },
        lock: { mode: "pessimistic_write" },
      });

      if (!pago) {
        throw new NotFoundException("Pago no encontrado");
      }

      if (pago.estado_pago !== "EN_REVISION") {
        throw new BadRequestException("El pago no se encuentra en revisión");
      }

      pago.estado_pago = dto.estado_pago;
      pago.observacion = dto.observacion ?? "";

      await manager.save(pago);

      const pedido = pago.pedido;
      pedido.estado_pago = dto.estado_pago;

      if (dto.estado_pago === "PAGADO") {
        pedido.estado_pedido = "CONFIRMADO";
      } else {
        pedido.estado_pedido = "PENDIENTE";
      }

      await manager.save(pedido);

      return {
        mensaje:
          dto.estado_pago === "PAGADO"
            ? "Pago confirmado correctamente"
            : "Pago rechazado",
        pago,
        pedido,
      };
    });
  }

  async cancelarPedido(
    id_pedido: number,
    id_usuario: number,
    dto: CancelarPedidoDto,
    esAdministrador: boolean,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const pedido = await manager.findOne(Pedido, {
        where: { id_pedido },
        relations: {
          usuario: true,
          detalles: {
            productoColor: true,
          },
        },
        lock: { mode: "pessimistic_write" },
      });

      if (!pedido) {
        throw new NotFoundException("Pedido no encontrado");
      }

      if (!esAdministrador && pedido.usuario.id_usuario !== id_usuario) {
        throw new BadRequestException(
          "No tienes permiso para cancelar este pedido",
        );
      }

      if (
        pedido.estado_pedido === "CANCELADO" ||
        pedido.estado_pedido === "ENTREGADO"
      ) {
        throw new BadRequestException(
          "El pedido ya está cancelado o entregado",
        );
      }

      if (pedido.estado_pago === "PAGADO") {
        throw new BadRequestException(
          "Un pedido pagado requiere gestionar primero su devolución",
        );
      }

      for (const detalle of pedido.detalles) {
        const productoColor = await manager
          .getRepository(ProductoColor)
          .createQueryBuilder("pc")
          .setLock("pessimistic_write")
          .where("pc.id_producto_color = :id", {
            id: detalle.productoColor.id_producto_color,
          })
          .getOne();

        if (!productoColor) {
          throw new NotFoundException(
            "No se encontró una combinación de producto y color",
          );
        }

        productoColor.stock += detalle.cantidad;
        await manager.save(productoColor);
      }

      pedido.estado_pedido = "CANCELADO";
      pedido.estado_pago = "CANCELADO";

      await manager.save(pedido);

      return {
        mensaje: "Pedido cancelado y stock devuelto correctamente",
        observacion: dto.observacion ?? "",
        pedido,
      };
    });
  }

  async actualizarEstado(id_pedido: number, dto: ActualizarEstadoPedidoDto) {
    const pedido = await this.pedidoRepository.findOne({
      where: { id_pedido },
    });

    if (!pedido) {
      throw new NotFoundException("Pedido no encontrado");
    }

    if (pedido.estado_pedido === "CANCELADO") {
      throw new BadRequestException("El pedido está cancelado");
    }

    if (pedido.estado_pedido === "ENTREGADO") {
      throw new BadRequestException("El pedido ya fue entregado");
    }

    if (pedido.estado_pago !== "PAGADO") {
      throw new BadRequestException(
        "No se puede avanzar un pedido sin confirmar su pago",
      );
    }

    const estadosPermitidos: Record<string, string[]> = {
      CONFIRMADO: ["EN_PROCESO"],
      EN_PROCESO: ["ENVIADO"],
      ENVIADO: ["ENTREGADO"],
    };

    if (
      dto.estado_pedido !== "CONFIRMADO" &&
      !estadosPermitidos[pedido.estado_pedido]?.includes(dto.estado_pedido)
    ) {
      throw new BadRequestException(
        "No se permite realizar ese cambio de estado",
      );
    }

    pedido.estado_pedido = dto.estado_pedido;

    return this.pedidoRepository.save(pedido);
  }
}
