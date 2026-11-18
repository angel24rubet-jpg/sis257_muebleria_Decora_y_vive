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

import { ProductosService } from "./productos.service";
import { CreateProductoDto } from "./dto/create-producto.dto";
import { UpdateProductoDto } from "./dto/update-producto.dto";
import { AsignarColoresDto } from "./dto/producto-color.dto";

import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("productos")
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // Registrar producto: solo administrador
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMINISTRADOR")
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  // Listar productos: publico
  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  // Buscar producto: publico
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  // Actualizar producto: solo administrador
  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMINISTRADOR")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(id, updateProductoDto);
  }

  // Actualizar colores y stock: solo administrador
  @Patch(":id/colores")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMINISTRADOR")
  asignarColores(
    @Param("id", ParseIntPipe) id: number,
    @Body() asignarColoresDto: AsignarColoresDto,
  ) {
    return this.productosService.asignarColores(id, asignarColoresDto);
  }

  // Eliminar producto: solo administrador
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMINISTRADOR")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }
}
