import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Color } from "./entities/color.entity";
import { CreateColorDto } from "./dto/create-color.dto";
import { UpdateColorDto } from "./dto/update-color.dto";

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

  // Desactivar un color (eliminación lógica)
  async remove(id: number) {
    const color = await this.findOne(id);

    color.estado = false;

    await this.colorRepository.save(color);

    return {
      mensaje: "Color desactivado correctamente",
    };
  }
  // Activar o desactivar un color
  async cambiarEstado(id: number) {
    const color = await this.findOne(id);

    color.estado = !color.estado;

    await this.colorRepository.save(color);

    return {
      mensaje: color.estado
        ? "Color activado correctamente"
        : "Color desactivado correctamente",
      color,
    };
  }
}
