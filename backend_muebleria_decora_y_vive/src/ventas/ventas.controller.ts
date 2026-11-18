import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";

import { VentasService } from "./ventas.service";
import { CreateVentaDto } from "./dto/create-venta.dto";
import { UpdateVentaDto } from "./dto/update-venta.dto";

import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("ventas")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMINISTRADOR")
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  // Registrar una venta: solo administrador
  @Post()
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventasService.create(createVentaDto);
  }

  // Listar ventas: solo administrador
  @Get()
  findAll() {
    return this.ventasService.findAll();
  }

  // Buscar venta: solo administrador
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.ventasService.findOne(id);
  }

  // Actualizar venta: solo administrador
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateVentaDto: UpdateVentaDto,
  ) {
    return this.ventasService.update(id, updateVentaDto);
  }

  // Anular venta: solo administrador
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.ventasService.remove(id);
  }
}
