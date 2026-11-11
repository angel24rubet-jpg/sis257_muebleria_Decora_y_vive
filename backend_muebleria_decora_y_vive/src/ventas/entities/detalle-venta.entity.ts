
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Venta } from './venta.entity';
import { ProductoColor } from '../../productos/entities/producto-color.entity';

@Entity('detalle_ventas')
export class DetalleVenta {
  @PrimaryGeneratedColumn({ name: 'id_detalle_venta' })
  id_detalle_venta: number;

  // Relacion con la venta
  @ManyToOne(() => Venta, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_venta' })
  venta: Venta;

  // Producto y color vendido
  @ManyToOne(() => ProductoColor, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_producto_color' })
  productoColor: ProductoColor;

  // Cantidad vendida
  @Column({ type: 'int', nullable: false })
  cantidad: number;

  // Precio unitario al momento de la venta
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  precio_unitario: string;

  // Subtotal del detalle
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  subtotal: string;
}
