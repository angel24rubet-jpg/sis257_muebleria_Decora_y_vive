import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { ProductoColor } from './entities/producto-color.entity';
import { Color } from '../colores/entities/color.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Producto,
      Categoria,
      ProductoColor,
      Color,
    ]),
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}