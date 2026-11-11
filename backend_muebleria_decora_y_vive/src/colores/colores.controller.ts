import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { ColoresService } from './colores.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Controller('colores')
export class ColoresController {
  constructor(private readonly coloresService: ColoresService) {}

  // Registrar un color
  @Post()
  create(@Body() createColorDto: CreateColorDto) {
    return this.coloresService.create(createColorDto);
  }

  // Listar todos los colores
  @Get()
  findAll() {
    return this.coloresService.findAll();
  }

  // Buscar un color por ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coloresService.findOne(id);
  }

  // Actualizar un color
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateColorDto: UpdateColorDto,
  ) {
    return this.coloresService.update(id, updateColorDto);
  }

  // Eliminar un color
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coloresService.remove(id);
  }
}