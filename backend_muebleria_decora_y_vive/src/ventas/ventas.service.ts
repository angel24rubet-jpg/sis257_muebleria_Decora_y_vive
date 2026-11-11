import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";

import { Venta } from "./entities/venta.entity";
import { DetalleVenta } from "./entities/detalle-venta.entity";
import { Cliente } from "../clientes/entities/cliente.entity";
import { ProductoColor } from "../productos/entities/producto-color.entity";

import { CreateVentaDto } from "./dto/create-venta.dto";
import { UpdateVentaDto } from "./dto/update-venta.dto";

@Injectable()
export class VentasService {
  constructor(
    // Conexion con la tabla ventas
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,

    // Conexion con la tabla clientes
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    // Conexion con la tabla detalle_ventas
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,

    // Conexion con la tabla producto_colores
    @InjectRepository(ProductoColor)
    private readonly productoColorRepository: Repository<ProductoColor>,

    // Conexion para realizar transacciones
    private readonly dataSource: DataSource,
  ) {}

  // Registrar una venta
  async create(createVentaDto: CreateVentaDto) {
    return await this.dataSource.transaction(async (manager) => {
      const cliente = await manager.findOneBy(Cliente, {
        id_cliente: createVentaDto.id_cliente,
      });

      if (!cliente || !cliente.estado) {
        throw new BadRequestException("El cliente no existe o esta inactivo");
      }

      const descuento = Math.round(Number(createVentaDto.descuento ?? 0) * 100);

      let subtotal = 0;
      const detallesPreparados = [];

      // Verificar que no existan productos y colores repetidos
      const idsProductoColor = createVentaDto.detalles.map(
        (detalle) => detalle.id_producto_color,
      );

      if (new Set(idsProductoColor).size !== idsProductoColor.length) {
        throw new BadRequestException(
          "No se puede repetir el mismo producto y color en una venta",
        );
      }

      // Verificar productos y existencias
      for (const detalle of createVentaDto.detalles) {
        const productoColor = await manager.findOne(ProductoColor, {
          where: {
            id_producto_color: detalle.id_producto_color,
          },
          relations: {
            producto: true,
            color: true,
          },
          lock: {
            mode: "pessimistic_write",
          },
        });

        if (!productoColor) {
          throw new NotFoundException(
            "El producto o color seleccionado no existe",
          );
        }

        if (!productoColor.producto.estado || !productoColor.color.estado) {
          throw new BadRequestException("El producto o color esta inactivo");
        }

        if (productoColor.stock < detalle.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para el color ${productoColor.color.nombre}`,
          );
        }

        const precioUnitario = Math.round(
          Number(productoColor.producto.precio) * 100,
        );

        const subtotalDetalle = precioUnitario * detalle.cantidad;

        subtotal += subtotalDetalle;

        detallesPreparados.push({
          productoColor,
          cantidad: detalle.cantidad,
          precioUnitario,
          subtotalDetalle,
        });
      }

      if (descuento > subtotal) {
        throw new BadRequestException(
          "El descuento no puede superar el subtotal",
        );
      }

      const total = subtotal - descuento;

      // Generar numero de comprobante
      const numeroComprobante = `V-${Date.now()}`;

      // Guardar los datos generales de la venta
      const venta = manager.create(Venta, {
        cliente,
        numero_comprobante: numeroComprobante,
        subtotal: (subtotal / 100).toFixed(2),
        descuento: (descuento / 100).toFixed(2),
        total: (total / 100).toFixed(2),
        estado: "COMPLETADA",
      });

      const ventaGuardada = await manager.save(Venta, venta);

      // Guardar detalles y descontar existencias
      for (const detalle of detallesPreparados) {
        const detalleVenta = manager.create(DetalleVenta, {
          venta: ventaGuardada,
          productoColor: detalle.productoColor,
          cantidad: detalle.cantidad,
          precio_unitario: (detalle.precioUnitario / 100).toFixed(2),
          subtotal: (detalle.subtotalDetalle / 100).toFixed(2),
        });

        await manager.save(DetalleVenta, detalleVenta);

        detalle.productoColor.stock -= detalle.cantidad;

        await manager.save(ProductoColor, detalle.productoColor);
      }

      return {
        mensaje: "Venta registrada correctamente",
        venta: ventaGuardada,
      };
    });
  }

  // Listar todas las ventas
  async findAll() {
    return await this.ventaRepository.find({
      relations: {
        cliente: true,
      },
      order: {
        id_venta: "DESC",
      },
    });
  }

  // Buscar una venta por ID
  async findOne(id: number) {
    const venta = await this.ventaRepository.findOne({
      where: {
        id_venta: id,
      },
      relations: {
        cliente: true,
      },
    });

    if (!venta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    const detalles = await this.detalleVentaRepository.find({
      where: {
        venta: {
          id_venta: id,
        },
      },
      relations: {
        productoColor: {
          producto: true,
          color: true,
        },
      },
    });

    return {
      ...venta,
      detalles,
    };
  }

  // Actualizar el estado de una venta
  async update(id: number, updateVentaDto: UpdateVentaDto) {
    return await this.dataSource.transaction(async (manager) => {
      const venta = await manager.findOneBy(Venta, {
        id_venta: id,
      });

      if (!venta) {
        throw new NotFoundException(`Venta con ID ${id} no encontrada`);
      }

      if (venta.estado === "ANULADA") {
        throw new ConflictException("La venta ya se encuentra anulada");
      }

      if (updateVentaDto.estado === "COMPLETADA") {
        return venta;
      }

      const detalles = await manager.find(DetalleVenta, {
        where: {
          venta: {
            id_venta: id,
          },
        },
        relations: {
          productoColor: true,
        },
      });

      // Devolver las existencias al anular la venta
      for (const detalle of detalles) {
        detalle.productoColor.stock += detalle.cantidad;

        await manager.save(ProductoColor, detalle.productoColor);
      }

      venta.estado = "ANULADA";

      return await manager.save(Venta, venta);
    });
  }

  // Evitar eliminar ventas para conservar el historial
  async remove(id: number) {
    await this.findOne(id);

    throw new BadRequestException(
      "No se permite eliminar ventas. Utilice la opcion de anular",
    );
  }
}
