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

  try {
    pedidos.value = await listarPedidos();
  } catch (e: any) {
    error.value = "No se pudieron cargar los pedidos.";
  } finally {
    cargando.value = false;
  }
}

async function revisarPago(idPago: number, estado: "PAGADO" | "RECHAZADO") {
  const observacion =
    estado === "RECHAZADO" ? prompt("Indica el motivo del rechazo:") || "" : "";

  if (estado === "RECHAZADO" && !observacion.trim()) {
    return;
  }

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

onMounted(cargarPedidos);
</script>

<template>
  <main class="pedidos">
    <h1>Gestión de pedidos</h1>
    <p>Administra las compras y verifica los pagos de tus clientes.</p>

    <p v-if="cargando">Cargando pedidos...</p>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>

    <div v-if="!cargando && pedidos.length === 0">
      No existen pedidos registrados.
    </div>

    <section v-for="pedido in pedidos" :key="pedido.id_pedido" class="pedido">
      <div class="encabezado">
        <h2>Pedido {{ pedido.numero_pedido }}</h2>
        <span>{{ pedido.estado_pedido }}</span>
      </div>

      <p><strong>Cliente:</strong> {{ pedido.usuario?.nombre_completo }}</p>
      <p><strong>Fecha:</strong> {{ pedido.fecha_pedido }}</p>
      <p><strong>Dirección:</strong> {{ pedido.direccion_entrega }}</p>
      <p><strong>Total:</strong> Bs {{ Number(pedido.total).toFixed(2) }}</p>

      <h3>Productos</h3>

      <div
        v-for="detalle in pedido.detalles"
        :key="detalle.id_detalle_pedido"
        class="detalle"
      >
        <span>{{ detalle.productoColor?.producto?.nombre }}</span>
        <span>Cantidad: {{ detalle.cantidad }}</span>
      </div>

      <h3>Información del pago</h3>

      <div v-for="pago in pedido.pagos" :key="pago.id_pago_pedido">
        <p>
          <strong>Titular:</strong> {{ pago.nombre_pagador || "No registrado" }}
        </p>
        <p>
          <strong>Comprobante:</strong>
          {{ pago.comprobante || "No registrado" }}
        </p>
        <p><strong>Estado del pago:</strong> {{ pago.estado_pago }}</p>

        <div v-if="pago.estado_pago === 'EN_REVISION'" class="acciones">
          <button @click="revisarPago(pago.id_pago_pedido, 'PAGADO')">
            Aprobar pago
          </button>

          <button
            class="rechazar"
            @click="revisarPago(pago.id_pago_pedido, 'RECHAZADO')"
          >
            Rechazar pago
          </button>
        </div>
      </div>

      <div v-if="pedido.estado_pago === 'PAGADO'" class="acciones">
        <button
          v-if="pedido.estado_pedido === 'CONFIRMADO'"
          @click="cambiarEstado(pedido.id_pedido, 'EN_PROCESO')"
        >
          Iniciar preparación
        </button>

        <button
          v-if="pedido.estado_pedido === 'EN_PROCESO'"
          @click="cambiarEstado(pedido.id_pedido, 'ENVIADO')"
        >
          Marcar como enviado
        </button>

        <button
          v-if="pedido.estado_pedido === 'ENVIADO'"
          @click="cambiarEstado(pedido.id_pedido, 'ENTREGADO')"
        >
          Marcar como entregado
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.pedidos {
  max-width: 1100px;
  margin: 30px auto;
  padding: 20px;
}

.pedido {
  background: white;
  padding: 22px;
  margin: 20px 0;
  border-radius: 12px;
  box-shadow: 0 3px 12px #00000015;
}

.encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.encabezado span {
  background: #eee5f5;
  color: #56336f;
  padding: 7px 12px;
  border-radius: 20px;
}

.detalle {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.acciones {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 15px 0;
}

button {
  background: #6c3b91;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 7px;
  cursor: pointer;
}

button.rechazar {
  background: #b83232;
}

.error {
  color: #c62828;
}

.mensaje {
  color: #287a43;
}
</style>
