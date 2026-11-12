import { Injectable, BadRequestException } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Venta } from "../ventas/entities/venta.entity";
import { DetalleVenta } from "../ventas/entities/detalle-venta.entity";
import { FiltroReporteDto } from "./dto/filtro-reporte.dto";

@Injectable()
export class ReportesService {
  constructor(
    // Conexion con la tabla ventas
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,

    // Conexion con la tabla detalle_ventas
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,
  ) {}

  // Generar reporte de ventas por periodo
  async generarReporte(filtro: FiltroReporteDto) {
    const { fecha_inicio, fecha_fin } = filtro;

    // Convertir y validar fechas DD/MM/YYYY
    const convertirFecha = (fecha: string): string => {
      const [dia, mes, anio] = fecha.split("/").map(Number);

      const fechaValidada = new Date(Date.UTC(anio, mes - 1, dia));

      // Comprobar que la fecha exista
      if (
        fechaValidada.getUTCDate() !== dia ||
        fechaValidada.getUTCMonth() !== mes - 1 ||
        fechaValidada.getUTCFullYear() !== anio
      ) {
        throw new BadRequestException(
          `La fecha ${fecha} no existe en el calendario`,
        );
      }

      // Convertir a formato YYYY-MM-DD para PostgreSQL
      return `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    };

    const inicio = convertirFecha(fecha_inicio);
    const fin = convertirFecha(fecha_fin);

    // Validar el rango de fechas
    if (inicio > fin) {
      throw new BadRequestException(
        "La fecha inicial no puede ser posterior a la fecha final",
      );
    }

    // Consultar ventas completadas
    const resultadoVentas = await this.ventaRepository
      .createQueryBuilder("venta")
      .select("COUNT(venta.id_venta)", "cantidad_ventas")
      .addSelect("COALESCE(SUM(venta.total), 0)", "ingresos")
      .addSelect("COALESCE(SUM(venta.descuento), 0)", "descuentos")
      .where("venta.estado = :estado", {
        estado: "COMPLETADA",
      })
      .andWhere("venta.fecha_venta >= CAST(:inicio AS date)", {
        inicio: inicio,
      })
      .andWhere("venta.fecha_venta < CAST(:fin AS date) + INTERVAL '1 day'", {
        fin: fin,
      })
      .getRawOne();

    // Consultar unidades vendidas
    const resultadoUnidades = await this.detalleVentaRepository
      .createQueryBuilder("detalle")
      .innerJoin("detalle.venta", "venta")
      .select("COALESCE(SUM(detalle.cantidad), 0)", "unidades_vendidas")
      .where("venta.estado = :estado", {
        estado: "COMPLETADA",
      })
      .andWhere("venta.fecha_venta >= CAST(:inicio AS date)", {
        inicio: inicio,
      })
      .andWhere("venta.fecha_venta < CAST(:fin AS date) + INTERVAL '1 day'", {
        fin: fin,
      })
      .getRawOne();

    // Convertir los resultados numericos
    const cantidadVentas = Number(resultadoVentas.cantidad_ventas);

    const ingresos = Number(resultadoVentas.ingresos);
    const descuentos = Number(resultadoVentas.descuentos);
    const unidadesVendidas = Number(resultadoUnidades.unidades_vendidas);

    // Calcular promedio por venta
    const promedioVenta = cantidadVentas > 0 ? ingresos / cantidadVentas : 0;

    // Devolver el reporte
    return {
      periodo: {
        fecha_inicio,
        fecha_fin,
      },
      indicadores: {
        ventas_realizadas: cantidadVentas,
        ingresos: ingresos.toFixed(2),
        descuentos: descuentos.toFixed(2),
        unidades_vendidas: unidadesVendidas,
        promedio_por_venta: promedioVenta.toFixed(2),
      },
    };
  }
}
