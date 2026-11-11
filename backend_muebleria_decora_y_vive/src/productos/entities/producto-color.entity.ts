import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { Producto } from './producto.entity';
import { Color } from '../../colores/entities/color.entity';

@Entity('producto_colores')
@Unique(['producto', 'color'])
export class ProductoColor {
  @PrimaryGeneratedColumn({ name: 'id_producto_color' })
  id_producto_color: number;

  // Relacion con el producto
  @ManyToOne(() => Producto, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;

  // Relacion con el color
  @ManyToOne(() => Color, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_color' })
  color: Color;

  // Cantidad disponible de este color
  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;
}