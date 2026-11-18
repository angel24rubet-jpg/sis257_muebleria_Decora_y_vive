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
  <main class="checkout-seccion container py-5">
    <!-- ENCABEZADO -->
    <div class="checkout-encabezado text-center mb-4">
      <span class="subtitulo">DECORA Y VIVE</span>
      <h1>Finalizar compra</h1>
      <p>Completa los datos para recibir tus muebles en casa.</p>
    </div>

    <!-- REGISTRO DEL PEDIDO -->
    <div v-if="!pedido" class="row g-4 align-items-start">
      <!-- DATOS DE ENTREGA -->
      <div class="col-12 col-lg-7">
        <section class="checkout-card card border-0">
          <div class="card-body p-4">
            <div class="titulo-seccion">
              <span class="numero-paso">01</span>
              <div>
                <h2>Datos de entrega</h2>
                <p>Indica dónde deseas recibir tu pedido.</p>
              </div>
            </div>

            <label for="direccion" class="form-label">
              Dirección de entrega
            </label>

            <textarea
              id="direccion"
              v-model="direccion"
              class="form-control campo-checkout"
              placeholder="Ingresa tu dirección completa, zona, calle y referencias..."
              rows="4"
              maxlength="500"
            ></textarea>

            <div class="nota-entrega">
              <i class="pi pi-map-marker"></i>
              <span>Verifica que tu dirección sea correcta.</span>
            </div>
          </div>
        </section>
      </div>

      <!-- RESUMEN -->
      <div class="col-12 col-lg-5">
        <section class="checkout-card card border-0">
          <div class="card-body p-4">
            <div class="titulo-seccion">
              <span class="numero-paso">02</span>
              <div>
                <h2>Resumen de compra</h2>
                <p>Revisa los productos de tu pedido.</p>
              </div>
            </div>

            <div
              v-for="producto in carrito.productos"
              :key="producto.id_producto_color"
              class="producto-resumen"
            >
              <div>
                <strong>{{ producto.nombre }}</strong>
                <span>Color: {{ producto.color }}</span>
                <small>Cantidad: {{ producto.cantidad }}</small>
              </div>

              <strong>
                Bs {{ (producto.precio * producto.cantidad).toFixed(2) }}
              </strong>
            </div>

            <div class="total-resumen">
              <span>Total a pagar</span>
              <strong>Bs {{ carrito.total.toFixed(2) }}</strong>
            </div>

            <p v-if="error" class="mensaje-error">
              <i class="pi pi-exclamation-circle"></i>
              {{ error }}
            </p>

            <button
              class="btn btn-confirmar w-100"
              @click="finalizarCompra"
              :disabled="cargando || !carrito.productos.length"
            >
              <i class="pi pi-check-circle me-2"></i>
              {{ cargando ? "Registrando pedido..." : "CONFIRMAR PEDIDO" }}
            </button>

            <div class="seguridad-checkout">
              <i class="pi pi-shield"></i>
              Compra segura y atención personalizada
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- PAGO DEL PEDIDO -->
    <section v-else class="pago-seccion">
      <div class="mensaje-pedido text-center">
        <div class="icono-exito">
          <i class="pi pi-check"></i>
        </div>

        <h2>¡Pedido registrado correctamente!</h2>

        <p>Tu pedido ha sido registrado en nuestro sistema.</p>

        <div class="numero-pedido">
          Número de pedido:
          <strong>{{ pedido.numero_pedido }}</strong>
        </div>

        <div class="total-pedido">
          Total a pagar:
          <strong>Bs {{ Number(pedido.total).toFixed(2) }}</strong>
        </div>
      </div>

      <div v-if="!pagoEnviado" class="pago-card card border-0">
        <div class="card-body p-4">
          <div class="text-center mb-4">
            <span class="subtitulo">PASO FINAL</span>
            <h2>Realiza tu pago mediante QR</h2>
            <p>Escanea el código QR para realizar el depósito.</p>
          </div>

          <div class="qr-contenedor">
            <img src="/qr-pago.png" alt="Código QR de demostración" />
          </div>

          <div class="aviso-qr">
            <i class="pi pi-info-circle"></i>
            <span>
              Después de realizar el depósito, completa los datos del
              comprobante para que podamos verificar tu pago.
            </span>
          </div>

          <div class="formulario-pago">
            <div class="mb-3">
              <label for="titular" class="form-label">
                Nombre del titular del depósito
              </label>

              <input
                id="titular"
                v-model="nombreTitular"
                type="text"
                class="form-control campo-checkout"
                placeholder="Nombre completo del titular"
                maxlength="100"
              />
            </div>

            <div class="mb-3">
              <label for="comprobante" class="form-label">
                Número de comprobante o referencia
              </label>

              <input
                id="comprobante"
                v-model="comprobante"
                type="text"
                class="form-control campo-checkout"
                placeholder="Ingresa el número de operación"
                maxlength="100"
              />
            </div>

            <p v-if="mensajePago" class="mensaje-error">
              <i class="pi pi-exclamation-circle"></i>
              {{ mensajePago }}
            </p>

            <button
              class="btn btn-confirmar w-100"
              @click="enviarComprobante"
              :disabled="enviandoPago"
            >
              <i class="pi pi-send me-2"></i>
              {{ enviandoPago ? "Enviando..." : "ENVIAR DATOS DE PAGO" }}
            </button>
          </div>
        </div>
      </div>

      <!-- CONFIRMACION DEL PAGO -->
      <div v-else class="confirmacion-pago card border-0">
        <div class="card-body text-center p-5">
          <div class="icono-exito">
            <i class="pi pi-check"></i>
          </div>

          <h2>¡Datos de pago enviados!</h2>

          <p>{{ mensajePago }}</p>

          <p>
            Tu pedido está pendiente de verificación por parte del
            administrador.
          </p>

          <button class="btn btn-confirmar" @click="router.push('/tienda')">
            <i class="pi pi-shopping-bag me-2"></i>
            VOLVER A LA TIENDA
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.checkout-seccion {
  max-width: 1000px;
  min-height: 450px;
  color: #49382e;
}

.checkout-encabezado {
  margin-bottom: 25px !important;
}

.checkout-encabezado h1 {
  font-family: "Playfair Display", serif;
  font-size: 29px;
  color: #49382e;
  margin: 8px 0;
}

.checkout-encabezado p {
  color: #8c8074;
  font-size: 12px;
}

.subtitulo {
  color: #a17e55;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 3px;
}

/* DISTRIBUCION DE LOS PANELES */
.checkout-seccion > .row {
  display: grid !important;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 20px;
  margin: 0;
}

.checkout-seccion > .row > div {
  width: 100%;
  max-width: 100%;
  padding: 0;
}

.checkout-card,
.pago-card,
.confirmacion-pago {
  background: white;
  border: 1px solid #eee9e1 !important;
  border-radius: 0;
}

.checkout-card .card-body {
  padding: 20px !important;
}

.titulo-seccion {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.numero-paso {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  background: #f5f0e8;
  color: #a17e55;
  font-family: "Playfair Display", serif;
  font-size: 14px;
}

.titulo-seccion h2 {
  font-family: "Playfair Display", serif;
  font-size: 19px;
  margin: 0 0 3px;
  color: #49382e;
}

.titulo-seccion p {
  margin: 0;
  color: #8c8074;
  font-size: 10px;
}

.checkout-card .form-label,
.formulario-pago .form-label {
  color: #625448;
  font-size: 11px;
  font-weight: 600;
}

.campo-checkout {
  border: 1px solid #e3dcd2;
  border-radius: 0;
  background: #faf8f4;
  color: #49382e;
  padding: 10px;
  font-size: 11px;
}

.campo-checkout:focus {
  border-color: #a17e55;
  box-shadow: 0 0 0 0.15rem rgba(161, 126, 85, 0.12);
  background: white;
}

.campo-checkout::placeholder {
  color: #aa9c8d;
}

textarea.campo-checkout {
  resize: vertical;
  min-height: 100px;
}

.nota-entrega {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #8c8074;
  font-size: 10px;
  margin-top: 10px;
}

.nota-entrega i {
  color: #a17e55;
  font-size: 13px;
}

/* PRODUCTOS DEL RESUMEN */
.producto-resumen {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 11px 0;
  border-bottom: 1px solid #eee9e1;
  font-size: 10px;
}

.producto-resumen div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.producto-resumen div strong {
  color: #49382e;
  font-size: 11px;
}

.producto-resumen span,
.producto-resumen small {
  color: #8c8074;
}

.producto-resumen > strong {
  color: #a17e55;
  white-space: nowrap;
  font-size: 11px;
}

.total-resumen {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
  padding-top: 5px;
}

.total-resumen span {
  font-size: 12px;
  font-weight: 600;
}

.total-resumen strong {
  color: #a17e55;
  font-size: 18px;
}

.btn-confirmar {
  background: #49382e;
  color: white;
  border: none;
  border-radius: 0;
  padding: 12px;
  font-size: 10px;
  letter-spacing: 0.5px;
}

.btn-confirmar:hover {
  background: #a17e55;
  color: white;
}

.btn-confirmar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.seguridad-checkout {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
  margin-top: 14px;
  color: #8c8074;
  font-size: 9px;
}

.seguridad-checkout i {
  color: #a17e55;
}

.mensaje-error {
  color: #b83232;
  font-size: 11px;
  margin: 12px 0;
}

/* CONFIRMACION DEL PEDIDO */
.pago-seccion {
  max-width: 600px;
  margin: auto;
}

.mensaje-pedido {
  margin-bottom: 22px;
}

.icono-exito {
  width: 45px;
  height: 45px;
  margin: 0 auto 12px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #eee6da;
  color: #80684e;
  font-size: 21px;
}

.mensaje-pedido h2,
.confirmacion-pago h2 {
  font-family: "Playfair Display", serif;
  font-size: 22px;
  color: #49382e;
}

.mensaje-pedido p,
.confirmacion-pago p {
  color: #8c8074;
  font-size: 11px;
}

.numero-pedido {
  font-size: 11px;
  margin: 12px 0 7px;
  color: #75685c;
}

.numero-pedido strong {
  color: #49382e;
}

.total-pedido {
  font-size: 13px;
  color: #75685c;
}

.total-pedido strong {
  color: #a17e55;
  font-size: 18px;
}

.pago-card h2 {
  font-family: "Playfair Display", serif;
  font-size: 21px;
  color: #49382e;
}

.pago-card p {
  color: #8c8074;
  font-size: 11px;
}

.qr-contenedor {
  width: 180px;
  height: 180px;
  margin: 15px auto;
  padding: 8px;
  border: 1px solid #eee9e1;
  background: white;
}

.qr-contenedor img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.aviso-qr {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #f5f0e8;
  padding: 12px;
  color: #75685c;
  font-size: 10px;
  line-height: 1.5;
  margin: 15px 0;
}

.aviso-qr i {
  color: #a17e55;
  font-size: 14px;
}

.formulario-pago {
  max-width: 400px;
  margin: 20px auto 0;
}

.confirmacion-pago {
  text-align: center;
}

/* TABLETS Y CELULARES */
@media (max-width: 767px) {
  .checkout-seccion > .row {
    grid-template-columns: 1fr;
  }

  .checkout-encabezado h1 {
    font-size: 26px;
  }

  .checkout-card .card-body,
  .pago-card .card-body {
    padding: 16px !important;
  }
}
</style>
