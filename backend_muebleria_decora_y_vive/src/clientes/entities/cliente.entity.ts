
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn({ name: 'id_cliente' })
  id_cliente: number;

  // Nombres del cliente
  @Column({ type: 'varchar', length: 100, nullable: false })
  nombres: string;

  // Apellidos del cliente
  @Column({ type: 'varchar', length: 100, nullable: false })
  apellidos: string;

  // Carnet de identidad
  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  ci: string;

    // Numero de telefono
  @Column({ type: 'varchar', length: 20, nullable: false })
  telefono: string;

  // Correo electronico
  @Column({ type: 'varchar', length: 120, nullable: false })
  correo: string;

  // Direccion del cliente
  @Column({ type: 'varchar', length: 250, nullable: false })
  direccion: string;

  // Estado del cliente
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  // Fecha de registro
  @CreateDateColumn({
    name: 'fecha_registro',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_registro: Date;
}
