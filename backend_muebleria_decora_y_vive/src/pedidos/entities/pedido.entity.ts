import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

import { Usuario } from "../../usuarios/entities/usuario.entity";
import { DetallePedido } from "./detalle-pedido.entity";
import { PagoPedido } from "./pago-pedido.entity";

@Entity("pedidos")
export class Pedido {
  @PrimaryGeneratedColumn({ name: "id_pedido" })
  id_pedido: number;

  // Cliente que realiza el pedido
  @ManyToOne(() => Usuario, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "id_usuario" })
  usuario: Usuario;

  // Numero unico del pedido
  @Column({ type: "varchar", length: 30, unique: true })
  numero_pedido: string;

  // Fecha de registro
  @CreateDateColumn({ name: "fecha_pedido", type: "timestamp" })
  fecha_pedido: Date;

  // Importes
  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  descuento: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  total: number;

  // Direccion de entrega
  @Column({ type: "varchar", length: 250 })
  direccion_entrega: string;

  // Estado del pedido
  @Column({ type: "varchar", length: 30, default: "PENDIENTE" })
  estado_pedido: string;

  // Estado del pago
  @Column({ type: "varchar", length: 30, default: "PENDIENTE" })
  estado_pago: string;

  // Detalles del pedido
  @OneToMany(() => DetallePedido, (detalle) => detalle.pedido)
  detalles: DetallePedido[];

  // Pago asociado
  @OneToMany(() => PagoPedido, (pago) => pago.pedido)
  pagos: PagoPedido[];
}
