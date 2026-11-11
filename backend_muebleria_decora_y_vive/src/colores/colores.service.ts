import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Color } from './entities/color.entity';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Injectable()
export class ColoresService {
  constructor(
    // Conexion con la tabla colores
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  // Registrar un color
  async create(createColorDto: CreateColorDto) {
    const color = this.colorRepository.create(createColorDto);
    return await this.colorRepository.save(color);
  }

  // Listar todos los colores
  async findAll() {
    return await this.colorRepository.find();
  }

  // Buscar un color por ID
  async findOne(id: number) {
    const color = await this.colorRepository.findOneBy({
      id_color: id,
    });

    if (!color) {
      throw new NotFoundException(`Color con ID ${id} no encontrado`);
    }

    return color;
  }

  // Actualizar un color
  async update(id: number, updateColorDto: UpdateColorDto) {
    const color = await this.findOne(id);

    Object.assign(color, updateColorDto);

    return await this.colorRepository.save(color);
  }

  // Eliminar un color
  async remove(id: number) {
    const color = await this.findOne(id);
    await this.colorRepository.remove(color);

    return { mensaje: 'Color eliminado correctamente' };
  }
}