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

import { CategoriasService } from "./categorias.service";
import { CreateCategoriaDto } from "./dto/create-categoria.dto";
import { UpdateCategoriaDto } from "./dto/update-categoria.dto";

import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("categorias")
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  // Registrar categoria: solo administrador
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMINISTRADOR")
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  // Listar categorias: publico
  @Get()
  findAll() {
    return this.categoriasService.findAll();
  }

  // Buscar categoria: publico
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.categoriasService.findOne(id);
  }

  // Modificar categoria: solo administrador
  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMINISTRADOR")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  // Eliminar categoria: solo administrador
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMINISTRADOR")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.categoriasService.remove(id);
  }

  // Cambiar estado: solo administrador
  @Patch(":id/estado")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMINISTRADOR")
  cambiarEstado(@Param("id", ParseIntPipe) id: number) {
    return this.categoriasService.cambiarEstado(id);
  }
}
