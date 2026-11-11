import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id_usuario: number;

  // Nombre completo del usuario
  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre_completo: string;

  // Nombre de usuario para iniciar sesion
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  usuario: string;

  // Correo electronico
  @Column({ type: 'varchar', length: 120, unique: true, nullable: false })
  correo: string;

  // Contrasena almacenada mediante hash
  @Column({ type: 'varchar', length: 255, nullable: false, select: false })
  password: string;

  // Rol del usuario
  @Column({ type: 'varchar', length: 30, default: 'VENDEDOR' })
  rol: string;

  // Estado del usuario
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
