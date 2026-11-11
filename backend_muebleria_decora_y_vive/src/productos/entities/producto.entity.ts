import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn({ name: 'id_producto' })
  id_producto: number;

  // Nombre del mueble
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  nombre: string;

  // Descripcion del producto
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  descripcion: string;

  // Precio unico para todos los colores
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  precio: string;

  // Enlace de la fotografia
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  fotografia: string;

  // Relacion con categorias
  @ManyToOne(() => Categoria, { nullable: false })
  @JoinColumn({ name: 'id_categoria' })
  categoria: Categoria;

  // Estado del producto
  @Column({
    type: 'boolean',
    default: true,
  })
  estado: boolean;

  // Fecha de registro
  @CreateDateColumn({
    name: 'fecha_registro',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_registro: Date;
}