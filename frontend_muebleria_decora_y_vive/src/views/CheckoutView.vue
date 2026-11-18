<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import { useCarritoStore } from "@/stores/carrito";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const carrito = useCarritoStore();
const auth = useAuthStore();

const direccion = ref("");
const cargando = ref(false);
const error = ref("");
const pedido = ref<any>(null);

const nombreTitular = ref("");
const comprobante = ref("");
const enviandoPago = ref(false);
const mensajePago = ref("");
const pagoEnviado = ref(false);

async function finalizarCompra() {
  if (!auth.autenticado || auth.usuario?.rol !== "CLIENTE") {
    router.push("/login");
    return;
  }

  if (!direccion.value.trim()) {
    error.value = "Ingresa tu dirección de entrega.";
    return;
  }

  if (carrito.productos.length === 0) {
    error.value = "Tu carrito está vacío.";
    return;
  }

  cargando.value = true;
  error.value = "";

  try {
    const datos = {
      direccion_entrega: direccion.value.trim(),
      detalles: carrito.productos.map((producto) => ({
        id_producto_color: producto.id_producto_color,
        cantidad: producto.cantidad,
      })),
    };

    const respuesta = await api.post("/pedidos", datos);

    pedido.value = respuesta.data;
    carrito.vaciar();
  } catch (e: any) {
    error.value =
      e.response?.data?.message ||
      "No se pudo registrar el pedido. Verifica las existencias.";
  } finally {
    cargando.value = false;
  }
}

async function enviarComprobante() {
  if (!nombreTitular.value.trim() || !comprobante.value.trim()) {
    mensajePago.value =
      "Completa el nombre del titular y la referencia del comprobante.";
    return;
  }

  enviandoPago.value = true;
  mensajePago.value = "";

  try {
    await api.patch(`/pedidos/${pedido.value.id_pedido}/comprobante`, {
      nombre_pagador: nombreTitular.value.trim(),
      comprobante: comprobante.value.trim(),
    });

    pagoEnviado.value = true;
    mensajePago.value =
      "Datos enviados correctamente. Espera la verificación del administrador.";
  } catch (e: any) {
    mensajePago.value =
      e.response?.data?.message || "No se pudieron enviar los datos del pago.";
  } finally {
    enviandoPago.value = false;
  }
}
</script>

<template>
  <main class="checkout">
    <h1>Finalizar compra</h1>

    <!-- REGISTRO DEL PEDIDO -->
    <div v-if="!pedido" class="contenido">
      <section class="datos">
        <h2>Datos de entrega</h2>

        <label>Dirección de entrega</label>
        <textarea
          v-model="direccion"
          placeholder="Ingresa tu dirección completa"
          rows="4"
        ></textarea>

        <h2>Resumen de compra</h2>

        <article
          v-for="producto in carrito.productos"
          :key="producto.id_producto_color"
          class="producto"
        >
          <span>{{ producto.nombre }} - {{ producto.color }}</span>
          <span>
            {{ producto.cantidad }} x Bs
            {{ producto.precio.toFixed(2) }}
          </span>
        </article>

        <h3>Total: Bs {{ carrito.total.toFixed(2) }}</h3>

        <p v-if="error" class="error">{{ error }}</p>

        <button
          @click="finalizarCompra"
          :disabled="cargando || !carrito.productos.length"
        >
          {{ cargando ? "Registrando pedido..." : "Confirmar pedido" }}
        </button>
      </section>
    </div>

    <!-- PAGO DEL PEDIDO -->
    <section v-else class="pago">
      <h2>¡Pedido registrado correctamente!</h2>

      <p>
        Número de pedido:
        <strong>{{ pedido.numero_pedido }}</strong>
      </p>

      <h3>Total a pagar: Bs {{ Number(pedido.total).toFixed(2) }}</h3>

      <div v-if="!pagoEnviado">
        <h2>Realiza tu pago mediante QR</h2>

        <img src="/qr-pago.png" alt="Código QR provisional de demostración" />

        <p>Una vez realizado el depósito, registra los siguientes datos:</p>

        <label>Nombre del titular del depósito</label>
        <input
          v-model="nombreTitular"
          type="text"
          placeholder="Nombre completo del titular"
          maxlength="100"
        />

        <label>Número de comprobante o referencia</label>
        <input
          v-model="comprobante"
          type="text"
          placeholder="Ingresa el número de operación"
          maxlength="100"
        />

        <p v-if="mensajePago" class="error">
          {{ mensajePago }}
        </p>

        <button @click="enviarComprobante" :disabled="enviandoPago">
          {{ enviandoPago ? "Enviando..." : "Enviar datos de pago" }}
        </button>
      </div>

      <div v-else class="confirmacion">
        <h2>Datos de pago enviados</h2>
        <p>{{ mensajePago }}</p>
        <p>Tu pedido está pendiente de verificación.</p>

        <button @click="router.push('/tienda')">Volver a la tienda</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.checkout {
  max-width: 850px;
  margin: 40px auto;
  padding: 25px;
}

h1,
h2 {
  color: #56336f;
}

.datos,
.pago {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 3px 12px #00000015;
}

label {
  display: block;
  margin: 15px 0 8px;
  font-weight: 600;
}

textarea,
input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
}

.producto {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

button {
  margin-top: 20px;
  padding: 12px 22px;
  background: #6c3b91;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #c62828;
}

.pago {
  text-align: center;
}

.pago img {
  display: block;
  width: 250px;
  max-width: 100%;
  margin: 20px auto;
}

.confirmacion {
  padding: 20px;
  background: #f5f0fa;
  border-radius: 10px;
}
</style>
