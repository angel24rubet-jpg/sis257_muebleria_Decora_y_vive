<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  listarPedidos,
  verificarPago,
  actualizarEstadoPedido,
} from "@/services/pedidosService";

const pedidos = ref<any[]>([]);
const cargando = ref(true);
const error = ref("");
const mensaje = ref("");

async function cargarPedidos() {
  cargando.value = true;
  error.value = "";
  mensaje.value = "";

  try {
    pedidos.value = await listarPedidos();
  } catch (e: any) {
    error.value =
      e.response?.data?.message || "No se pudieron cargar los pedidos.";
  } finally {
    cargando.value = false;
  }
}

async function revisarPago(idPago: number, estado: "PAGADO" | "RECHAZADO") {
  const observacion =
    estado === "RECHAZADO" ? prompt("Indica el motivo del rechazo:") || "" : "";

  if (estado === "RECHAZADO" && !observacion.trim()) return;

  try {
    await verificarPago(idPago, {
      estado_pago: estado,
      observacion,
    });

    mensaje.value =
      estado === "PAGADO"
        ? "Pago aprobado correctamente."
        : "Pago rechazado correctamente.";

    await cargarPedidos();
  } catch (e: any) {
    error.value = e.response?.data?.message || "No se pudo actualizar el pago.";
  }
}

async function cambiarEstado(id: number, estado: string) {
  try {
    await actualizarEstadoPedido(id, estado);
    mensaje.value = "Estado del pedido actualizado.";
    await cargarPedidos();
  } catch (e: any) {
    error.value =
      e.response?.data?.message || "No se pudo actualizar el pedido.";
  }
}

function formatoFecha(fecha: string) {
  if (!fecha) return "No disponible";
  return new Date(fecha).toLocaleDateString("es-BO");
}

function claseEstado(estado: string) {
  const clases: Record<string, string> = {
    PENDIENTE: "estado-pendiente",
    EN_REVISION: "estado-revision",
    PAGADO: "estado-pagado",
    RECHAZADO: "estado-rechazado",
    CONFIRMADO: "estado-confirmado",
    EN_PROCESO: "estado-proceso",
    ENVIADO: "estado-enviado",
    ENTREGADO: "estado-entregado",
  };

  return clases[estado] || "estado-pendiente";
}

onMounted(cargarPedidos);
</script>

<template>
  <main class="container pedidos-admin py-4">
    <div class="encabezado-pedidos">
      <div>
        <span class="subtitulo">DECORA Y VIVE · ADMINISTRACIÓN</span>
        <h1>Gestión de pedidos</h1>
        <p>Administra las compras y verifica los pagos de tus clientes.</p>
      </div>

      <button
        class="btn-actualizar"
        @click="cargarPedidos"
        :disabled="cargando"
      >
        <i class="pi pi-refresh"></i>
        Actualizar
      </button>
    </div>

    <div v-if="error" class="alerta error">{{ error }}</div>
    <div v-if="mensaje" class="alerta exito">{{ mensaje }}</div>

    <div v-if="cargando" class="estado-vacio">
      <i class="pi pi-spin pi-spinner"></i>
      Cargando pedidos...
    </div>

    <div v-else-if="pedidos.length === 0" class="estado-vacio">
      <i class="pi pi-shopping-bag"></i>
      <h2>No hay pedidos registrados</h2>
    </div>

    <section
      v-for="pedido in pedidos"
      :key="pedido.id_pedido"
      class="pedido-card"
    >
      <div class="pedido-cabecera">
        <div>
          <span class="subtitulo">PEDIDO</span>
          <h2>{{ pedido.numero_pedido }}</h2>
          <small>Fecha: {{ formatoFecha(pedido.fecha_pedido) }}</small>
        </div>

        <span class="estado" :class="claseEstado(pedido.estado_pedido)">
          {{ pedido.estado_pedido }}
        </span>
      </div>

      <div class="pedido-contenido">
        <div class="seccion">
          <h3><i class="pi pi-user"></i> Datos del cliente</h3>
          <p><strong>Cliente:</strong> {{ pedido.usuario?.nombre_completo }}</p>
          <p><strong>Dirección:</strong> {{ pedido.direccion_entrega }}</p>
          <p class="total-pedido">
            Total del pedido: Bs {{ Number(pedido.total).toFixed(2) }}
          </p>
        </div>

        <div class="seccion">
          <h3><i class="pi pi-box"></i> Productos solicitados</h3>

          <div
            v-for="detalle in pedido.detalles"
            :key="detalle.id_detalle_pedido"
            class="producto-detalle"
          >
            <img
              v-if="detalle.productoColor?.producto?.fotografia"
              :src="detalle.productoColor.producto.fotografia"
              :alt="detalle.productoColor.producto.nombre"
              class="foto-producto"
            />

            <div v-else class="foto-sin-imagen">
              <i class="pi pi-image"></i>
            </div>

            <div class="producto-info">
              <strong>
                {{ detalle.productoColor?.producto?.nombre || "Producto" }}
              </strong>
              <small>
                Color:
                {{ detalle.productoColor?.color?.nombre || "No especificado" }}
              </small>
              <small>Cantidad: {{ detalle.cantidad }}</small>
            </div>

            <div class="producto-precio">
              <strong>
                Bs {{ Number(detalle.precio_unitario).toFixed(2) }}
              </strong>
              <small>
                Subtotal: Bs {{ Number(detalle.subtotal).toFixed(2) }}
              </small>
            </div>
          </div>
        </div>

        <div class="seccion">
          <h3><i class="pi pi-wallet"></i> Información del pago</h3>

          <div
            v-for="pago in pedido.pagos"
            :key="pago.id_pago_pedido"
            class="pago-detalle"
          >
            <p>
              <strong>Titular:</strong>
              {{ pago.nombre_pagador || "No registrado" }}
            </p>
            <p>
              <strong>Comprobante:</strong>
              {{ pago.comprobante || "No registrado" }}
            </p>
            <p>
              <strong>Estado:</strong>
              <span class="estado" :class="claseEstado(pago.estado_pago)">
                {{ pago.estado_pago }}
              </span>
            </p>

            <div v-if="pago.estado_pago === 'EN_REVISION'" class="acciones">
              <button
                class="btn-aprobar"
                @click="revisarPago(pago.id_pago_pedido, 'PAGADO')"
              >
                <i class="pi pi-check"></i> Aprobar
              </button>

              <button
                class="btn-rechazar"
                @click="revisarPago(pago.id_pago_pedido, 'RECHAZADO')"
              >
                <i class="pi pi-times"></i> Rechazar
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="pedido.pagos?.some((p: any) => p.estado_pago === 'PAGADO')"
          class="seccion"
        >
          <h3><i class="pi pi-truck"></i> Estado del pedido</h3>

          <div class="acciones">
            <button
              v-if="pedido.estado_pedido === 'CONFIRMADO'"
              class="btn-estado"
              @click="cambiarEstado(pedido.id_pedido, 'EN_PROCESO')"
            >
              Iniciar preparación
            </button>

            <button
              v-if="pedido.estado_pedido === 'EN_PROCESO'"
              class="btn-estado"
              @click="cambiarEstado(pedido.id_pedido, 'ENVIADO')"
            >
              Marcar como enviado
            </button>

            <button
              v-if="pedido.estado_pedido === 'ENVIADO'"
              class="btn-estado"
              @click="cambiarEstado(pedido.id_pedido, 'ENTREGADO')"
            >
              Marcar como entregado
            </button>

            <span
              v-if="pedido.estado_pedido === 'ENTREGADO'"
              class="finalizado"
            >
              <i class="pi pi-check-circle"></i> Pedido entregado
            </span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.pedidos-admin {
  max-width: 1000px;
  color: #49382e;
  min-height: 500px;
}

.encabezado-pedidos {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 22px;
}

.subtitulo {
  color: #a17e55;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
}

.encabezado-pedidos h1 {
  font-family: "Playfair Display", serif;
  font-size: 28px;
  margin: 7px 0;
}

.encabezado-pedidos p {
  color: #8c8074;
  font-size: 12px;
  margin: 0;
}

.btn-actualizar,
.btn-estado {
  background: #49382e;
  color: white;
  border: 0;
  padding: 9px 14px;
  font-size: 11px;
  cursor: pointer;
}

.btn-actualizar:hover,
.btn-estado:hover {
  background: #a17e55;
}

.pedido-card {
  background: white;
  border: 1px solid #eee9e1;
  margin-bottom: 17px;
}

.pedido-cabecera {
  background: #faf8f4;
  border-bottom: 1px solid #eee9e1;
  padding: 13px 17px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pedido-cabecera h2 {
  font-family: "Playfair Display", serif;
  font-size: 19px;
  margin: 4px 0;
}

.pedido-cabecera small {
  color: #8c8074;
  font-size: 10px;
}

.pedido-contenido {
  padding: 15px 17px;
}

.seccion {
  padding-bottom: 13px;
  margin-bottom: 13px;
  border-bottom: 1px solid #eee9e1;
}

.seccion:last-child {
  border-bottom: 0;
  margin-bottom: 0;
}

.seccion h3 {
  font-family: "Playfair Display", serif;
  font-size: 16px;
  margin-bottom: 10px;
}

.seccion h3 i {
  color: #a17e55;
  margin-right: 7px;
  font-size: 13px;
}

.seccion p {
  font-size: 11px;
  color: #75685c;
  margin: 6px 0;
}

.total-pedido {
  font-weight: 700;
  color: #a17e55 !important;
}

.producto-detalle {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 9px 0;
  border-bottom: 1px solid #f1ede7;
}

.foto-producto,
.foto-sin-imagen {
  width: 68px;
  height: 62px;
  flex-shrink: 0;
  object-fit: contain;
  background: #faf8f4;
  border: 1px solid #eee9e1;
}

.foto-sin-imagen {
  display: grid;
  place-items: center;
  color: #a17e55;
}

.producto-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.producto-info strong,
.producto-precio strong {
  font-size: 11px;
  color: #49382e;
}

.producto-info small,
.producto-precio small {
  font-size: 10px;
  color: #8c8074;
}

.producto-precio {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  text-align: right;
}

.pago-detalle {
  padding: 12px;
  background: #faf8f4;
  border: 1px solid #eee9e1;
  margin-top: 8px;
}

.estado {
  display: inline-block;
  padding: 5px 9px;
  font-size: 9px;
  font-weight: 700;
  white-space: nowrap;
}

.estado-pendiente {
  background: #f5f0e8;
  color: #947345;
}
.estado-revision {
  background: #f8eddc;
  color: #a16d26;
}
.estado-pagado,
.estado-entregado {
  background: #e7f1e8;
  color: #367346;
}
.estado-rechazado {
  background: #f8e7e5;
  color: #a33c35;
}
.estado-confirmado {
  background: #e9edf5;
  color: #4d638b;
}
.estado-proceso {
  background: #e8eef5;
  color: #486c91;
}
.estado-enviado {
  background: #eee8f5;
  color: #73558f;
}

.acciones {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.btn-aprobar,
.btn-rechazar {
  border: 0;
  padding: 8px 12px;
  color: white;
  font-size: 10px;
  cursor: pointer;
}

.btn-aprobar {
  background: #496b4e;
}
.btn-rechazar {
  background: #a64a42;
}

.finalizado {
  color: #367346;
  font-size: 11px;
}

.alerta {
  padding: 10px 13px;
  font-size: 11px;
  margin-bottom: 13px;
}

.error {
  background: #f8e7e5;
  color: #a33c35;
}
.exito {
  background: #e7f1e8;
  color: #367346;
}

.estado-vacio {
  text-align: center;
  padding: 40px;
  background: white;
  color: #8c8074;
  font-size: 12px;
}

.estado-vacio i {
  font-size: 25px;
  color: #a17e55;
}

.estado-vacio h2 {
  font-family: "Playfair Display", serif;
  font-size: 20px;
  color: #49382e;
}

@media (max-width: 600px) {
  .encabezado-pedidos {
    align-items: flex-start;
    flex-direction: column;
  }

  .producto-detalle {
    flex-wrap: wrap;
  }

  .producto-precio {
    width: 100%;
    align-items: flex-start;
    text-align: left;
    margin-left: 81px;
  }
}
</style>
