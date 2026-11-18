import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

import { Pedido } from "./pedido.entity";

@Entity("pagos_pedido")
export class PagoPedido {
  @PrimaryGeneratedColumn({ name: "id_pago_pedido" })
  id_pago_pedido: number;

  // Pedido relacionado
  @ManyToOne(() => Pedido, (pedido) => pedido.pagos, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id_pedido" })
  pedido: Pedido;

  @Column({ type: "varchar", length: 100 })
  nombre_pagador: string;

  // Imagen del comprobante de pago
  @Column({ type: "varchar", length: 500, nullable: true })
  comprobante: string;

  // Fecha de registro del pago
  @CreateDateColumn({ name: "fecha_pago", type: "timestamp" })
  fecha_pago: Date;

  // Estado de verificacion
  @Column({ type: "varchar", length: 30, default: "PENDIENTE" })
  estado_pago: string;

  // Observacion del administrador
  @Column({ type: "varchar", length: 250, nullable: true })
  observacion: string;
}
