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

import { ColoresService } from "./colores.service";
import { CreateColorDto } from "./dto/create-color.dto";
import { UpdateColorDto } from "./dto/update-color.dto";

import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("colores")
export class ColoresController {
  constructor(private readonly coloresService: ColoresService) {}

  // Registrar color: solo administrador
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMINISTRADOR")
  create(@Body() createColorDto: CreateColorDto) {
    return this.coloresService.create(createColorDto);
  }

  // Listar colores: publico
  @Get()
  findAll() {
    return this.coloresService.findAll();
  }

  // Buscar color: publico
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.coloresService.findOne(id);
  }

  // Actualizar color: solo administrador
  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMINISTRADOR")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateColorDto: UpdateColorDto,
  ) {
    return this.coloresService.update(id, updateColorDto);
  }

  // Eliminar color: solo administrador
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMINISTRADOR")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.coloresService.remove(id);
  }

  // Activar o desactivar color: solo administrador
  @Patch(":id/estado")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMINISTRADOR")
  cambiarEstado(@Param("id", ParseIntPipe) id: number) {
    return this.coloresService.cambiarEstado(id);
  }
}
