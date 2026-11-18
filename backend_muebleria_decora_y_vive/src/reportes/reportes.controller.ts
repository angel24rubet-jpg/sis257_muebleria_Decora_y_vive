import { Controller, Get, Query, UseGuards } from "@nestjs/common";

import { ReportesService } from "./reportes.service";
import { FiltroReporteDto } from "./dto/filtro-reporte.dto";

import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("reportes")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMINISTRADOR")
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  // Generar reporte de ventas por periodo
  @Get("ventas")
  generarReporte(@Query() filtro: FiltroReporteDto) {
    return this.reportesService.generarReporte(filtro);
  }
}
