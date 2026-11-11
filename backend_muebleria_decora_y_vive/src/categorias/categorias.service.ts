import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    // Conexion con la tabla categorias
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  // Registrar una categoria
  async create(createCategoriaDto: CreateCategoriaDto) {
    const categoria = this.categoriaRepository.create(createCategoriaDto);
    return await this.categoriaRepository.save(categoria);
  }

  // Listar todas las categorias
  async findAll() {
    return await this.categoriaRepository.find();
  }

  // Buscar una categoria por ID
  async findOne(id: number) {
    const categoria = await this.categoriaRepository.findOneBy({
      id_categoria: id,
    });

    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return categoria;
  }

  // Actualizar una categoria
  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.findOne(id);

    Object.assign(categoria, updateCategoriaDto);

    return await this.categoriaRepository.save(categoria);
  }

  // Eliminar una categoria
  async remove(id: number) {
    const categoria = await this.findOne(id);
    await this.categoriaRepository.remove(categoria);

    return { mensaje: 'Categoría eliminada correctamente' };
  }
}
