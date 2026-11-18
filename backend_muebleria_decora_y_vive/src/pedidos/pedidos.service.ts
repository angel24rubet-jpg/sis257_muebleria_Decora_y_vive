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
          .getRepository(ProductoColor)
          .createQueryBuilder("pc")
          .leftJoinAndSelect("pc.producto", "producto")
          .leftJoinAndSelect("pc.color", "color")
          .setLock("pessimistic_write")
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
          productoColor: true,
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
          productoColor: true,
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
          productoColor: true,
        },
        pagos: true,
      },
    });

    if (!pedido) {
      throw new NotFoundException("Pedido no encontrado");
    }

    return pedido;
  }
}
