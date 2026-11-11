
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Cliente } from '../../clientes/entities/cliente.entity';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn({ name: 'id_venta' })
  id_venta: number;

  // Relacion con el cliente
  @ManyToOne(() => Cliente, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  // Numero de comprobante
  @Column({ type: 'varchar', length: 30, unique: true, nullable: false })
  numero_comprobante: string;

  // Fecha de la venta
  @CreateDateColumn({
    name: 'fecha_venta',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_venta: Date;

  // Subtotal de la venta
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  subtotal: string;

  // Descuento aplicado
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  descuento: string;

  // Total de la venta
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total: string;

  // Estado de la venta
  @Column({ type: 'varchar', length: 20, default: 'COMPLETADA' })
  estado: string;
}
