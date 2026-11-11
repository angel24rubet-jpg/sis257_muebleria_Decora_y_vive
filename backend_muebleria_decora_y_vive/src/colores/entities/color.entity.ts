import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('colores')
export class Color {
  @PrimaryGeneratedColumn({ name: 'id_color' })
  id_color: number;

  // Nombre del color
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  nombre: string;

  // Codigo hexadecimal del color
  @Column({
    type: 'varchar',
    length: 7,
    nullable: true,
  })
  codigo_hex: string;

  // Estado del color
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