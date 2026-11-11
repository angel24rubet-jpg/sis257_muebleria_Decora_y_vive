import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn({ name: 'id_categoria' })
  id_categoria: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  descripcion: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  estado: boolean;

  @CreateDateColumn({
    name: 'fecha_registro',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_registro: Date;
}
