import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Pedido } from "./pedido.entity";
import { ProductoColor } from "../../productos/entities/producto-color.entity";

@Entity("detalle_pedidos")
export class DetallePedido {
  @PrimaryGeneratedColumn({ name: "id_detalle_pedido" })
  id_detalle_pedido: number;

  // Pedido al que pertenece
  @ManyToOne(() => Pedido, (pedido) => pedido.detalles, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id_pedido" })
  pedido: Pedido;

  // Producto y color seleccionado
  @ManyToOne(() => ProductoColor, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "id_producto_color" })
  productoColor: ProductoColor;

  // Cantidad solicitada
  @Column({ type: "integer" })
  cantidad: number;

  // Precio al momento de realizar el pedido
  @Column({ type: "decimal", precision: 10, scale: 2 })
  precio_unitario: number;

  // Subtotal del detalle
  @Column({ type: "decimal", precision: 10, scale: 2 })
  subtotal: number;
}
