import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Producto } from "./entities/producto.entity";
import { Categoria } from "../categorias/entities/categoria.entity";
import { Color } from "../colores/entities/color.entity";
import { ProductoColor } from "./entities/producto-color.entity";

import { CreateProductoDto } from "./dto/create-producto.dto";
import { UpdateProductoDto } from "./dto/update-producto.dto";
import { AsignarColoresDto } from './dto/producto-color.dto';

@Injectable()
export class ProductosService {
  constructor(
    // Conexion con la tabla productos
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    // Conexion con la tabla categorias
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,

    // Conexion con la tabla colores
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,

    // Conexion con la tabla producto_colores
    @InjectRepository(ProductoColor)
    private readonly productoColorRepository: Repository<ProductoColor>,
  ) {}

  // Registrar un producto
  async create(createProductoDto: CreateProductoDto) {
    const { id_categoria, colores, ...datosProducto } = createProductoDto;

    const categoria = await this.categoriaRepository.findOneBy({
      id_categoria,
    });

    if (!categoria || !categoria.estado) {
      throw new BadRequestException("La categoria no existe o esta inactiva");
    }

    const idsColores = colores.map((item) => item.id_color);

    if (new Set(idsColores).size !== idsColores.length) {
      throw new BadRequestException(
        "No se puede repetir un color en el mismo producto",
      );
    }

    const coloresRegistrados = await this.colorRepository.findBy(
      idsColores.map((id) => ({ id_color: id })),
    );

    if (coloresRegistrados.length !== idsColores.length) {
      throw new BadRequestException("Uno o mas colores no existen");
    }

    if (coloresRegistrados.some((color) => !color.estado)) {
      throw new BadRequestException("No se pueden asignar colores inactivos");
    }

    // Convertir el precio antes de guardar el producto
    const producto = this.productoRepository.create({
      ...datosProducto,
      precio: String(datosProducto.precio),
      categoria,
    });

    const productoGuardado = await this.productoRepository.save(producto);

    const relaciones = colores.map((item) => {
      const color = coloresRegistrados.find(
        (color) => color.id_color === item.id_color,
      );

      return this.productoColorRepository.create({
        producto: productoGuardado,
        color,
        stock: item.stock,
      });
    });

    await this.productoColorRepository.save(relaciones);

    return await this.findOne(productoGuardado.id_producto);
  }

  // Listar todos los productos
  async findAll() {
    return await this.productoRepository.find({
      relations: {
        categoria: true,
      },
    });
  }

  // Buscar un producto por ID
  async findOne(id: number) {
    const producto = await this.productoRepository.findOne({
      where: { id_producto: id },
      relations: {
        categoria: true,
      },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    const colores = await this.productoColorRepository.find({
      where: {
        producto: { id_producto: id },
      },
      relations: {
        color: true,
      },
    });

    return {
      ...producto,
      colores,
    };
  }

  // Actualizar un producto
  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const producto = await this.findOne(id);

    const { id_categoria, colores, ...datosProducto } = updateProductoDto;

    if (id_categoria !== undefined) {
      const categoria = await this.categoriaRepository.findOneBy({
        id_categoria,
      });

      if (!categoria || !categoria.estado) {
        throw new BadRequestException("La categoria no existe o esta inactiva");
      }

      producto.categoria = categoria;
    }

    Object.assign(producto, datosProducto);

    await this.productoRepository.save(producto);

    if (colores !== undefined) {
      throw new BadRequestException(
        "La modificacion de colores se realizara mediante una operacion independiente",
      );
    }

    return await this.findOne(id);
  }

  // Eliminar un productoa
  async remove(id: number) {
    const producto = await this.productoRepository.findOneBy({
      id_producto: id,
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    await this.productoRepository.remove(producto);

    return {
      mensaje: "Producto eliminado correctamente",
    };
  }
  
// Actualizar los colores y el stock de un producto
async asignarColores(
  id: number,
  asignarColoresDto: AsignarColoresDto,
) {
  // Verificar que el producto exista
  const producto = await this.productoRepository.findOneBy({
    id_producto: id,
  });

  if (!producto) {
    throw new NotFoundException(
      `Producto con ID ${id} no encontrado`,
    );
  }

  const { colores } = asignarColoresDto;

  // Evitar colores repetidos
  const idsColores = colores.map((item) => item.id_color);

  if (new Set(idsColores).size !== idsColores.length) {
    throw new BadRequestException(
      'No se puede repetir un color en el mismo producto',
    );
  }

  // Verificar que los colores existan
  const coloresRegistrados = await this.colorRepository.findBy(
    idsColores.map((id) => ({ id_color: id })),
  );

  if (coloresRegistrados.length !== idsColores.length) {
    throw new BadRequestException(
      'Uno o más colores no existen',
    );
  }

  // Verificar que los colores estén activos
  if (coloresRegistrados.some((color) => !color.estado)) {
    throw new BadRequestException(
      'No se pueden asignar colores inactivos',
    );
  }

  // Eliminar las relaciones anteriores
  await this.productoColorRepository.delete({
    producto: { id_producto: id },
  });

  // Crear las nuevas relaciones
  const relaciones = colores.map((item) => {
    const color = coloresRegistrados.find(
      (color) => color.id_color === item.id_color,
    );

    return this.productoColorRepository.create({
      producto,
      color,
      stock: item.stock,
    });
  });

  await this.productoColorRepository.save(relaciones);

  return await this.findOne(id);
}

}
