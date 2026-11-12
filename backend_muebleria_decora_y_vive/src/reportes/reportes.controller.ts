import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';

import { ReportesService } from './reportes.service';
import { FiltroReporteDto } from './dto/filtro-reporte.dto';

@Controller('reportes')
export class ReportesController {
  constructor(
    private readonly reportesService: ReportesService,
  ) {}

  // Generar reporte de ventas por periodo
  @Get('ventas')
  generarReporte(@Query() filtro: FiltroReporteDto) {
    return this.reportesService.generarReporte(filtro);
  }
}
