<script setup lang="ts">
import { useRouter, RouterLink } from "vue-router";
import { useCarritoStore } from "@/stores/carrito";
import { useAuthStore } from "@/stores/auth";

const carrito = useCarritoStore();
const auth = useAuthStore();
const router = useRouter();

function continuarCompra() {
  if (!carrito.productos.length) {
    return;
  }

  if (!auth.autenticado || auth.usuario?.rol !== "CLIENTE") {
    router.push("/login");
    return;
  }

  router.push("/checkout");
}
</script>

<template>
  <main class="carrito-seccion container py-5">
    <!-- ENCABEZADO -->
    <div class="encabezado-carrito text-center mb-5">
      <span class="subtitulo">DECORA Y VIVE</span>
      <h1>Mi carrito de compras</h1>
      <p>Revisa tus productos antes de continuar con tu compra.</p>
    </div>

    <!-- CARRITO VACIO -->
    <div
      v-if="!carrito.productos.length"
      class="carrito-vacio card border-0 text-center p-5"
    >
      <div class="icono-vacio">
        <i class="pi pi-shopping-bag"></i>
      </div>

      <h2>Tu carrito está vacío</h2>
      <p>Aún no has agregado productos a tu carrito.</p>

      <div>
        <RouterLink to="/tienda" class="btn btn-cafe">
          <i class="pi pi-arrow-left me-2"></i>
          Continuar comprando
        </RouterLink>
      </div>
    </div>

    <!-- PRODUCTOS DEL CARRITO -->
    <div v-else class="row g-4 align-items-start">
      <div class="col-12 col-lg-8">
        <div class="productos-lista">
          <article
            v-for="producto in carrito.productos"
            :key="producto.id_producto_color"
            class="producto-carrito card border-0 mb-3"
          >
            <div class="row g-0 align-items-center">
              <!-- FOTOGRAFIA -->
              <div class="col-12 col-sm-4">
                <div class="imagen-carrito">
                  <img
                    v-if="producto.fotografia"
                    :src="producto.fotografia"
                    :alt="producto.nombre"
                  />

                  <div v-else class="imagen-sin-foto">
                    <i class="pi pi-image"></i>
                    <span>Sin fotografía</span>
                  </div>
                </div>
              </div>

              <!-- INFORMACION -->
              <div class="col-12 col-sm-8">
                <div class="producto-informacion">
                  <span class="etiqueta">DECORA Y VIVE</span>

                  <h3>{{ producto.nombre }}</h3>

                  <p class="color-producto">
                    Color: <strong>{{ producto.color }}</strong>
                  </p>

                  <div class="precio-unitario">
                    Bs {{ producto.precio.toFixed(2) }}
                  </div>

                  <!-- CANTIDAD -->
                  <div class="cantidad-contenedor">
                    <span>Cantidad:</span>

                    <div class="control-cantidad">
                      <button
                        @click="carrito.disminuir(producto.id_producto_color)"
                        type="button"
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>

                      <span>{{ producto.cantidad }}</span>

                      <button
                        @click="carrito.agregar(producto)"
                        type="button"
                        aria-label="Aumentar cantidad"
                        :disabled="producto.cantidad >= producto.stock"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <!-- SUBTOTAL Y ELIMINAR -->
                  <div
                    class="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3"
                  >
                    <strong class="subtotal">
                      Subtotal: Bs
                      {{ (producto.precio * producto.cantidad).toFixed(2) }}
                    </strong>

                    <button
                      class="btn-eliminar"
                      @click="carrito.quitar(producto.id_producto_color)"
                    >
                      <i class="pi pi-trash me-1"></i>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <RouterLink to="/tienda" class="volver-tienda">
          <i class="pi pi-arrow-left me-2"></i>
          Seguir comprando
        </RouterLink>
      </div>

      <!-- RESUMEN DE COMPRA -->
      <div class="col-12 col-lg-4">
        <div class="resumen-compra card border-0">
          <div class="card-body p-4">
            <span class="subtitulo">TU PEDIDO</span>

            <h2>Resumen de compra</h2>

            <div class="linea-resumen">
              <span>Productos</span>
              <strong>{{ carrito.cantidadProductos }}</strong>
            </div>

            <div class="linea-resumen">
              <span>Subtotal</span>
              <strong>Bs {{ carrito.total.toFixed(2) }}</strong>
            </div>

            <div class="linea-resumen">
              <span>Envío</span>
              <strong>Por coordinar</strong>
            </div>

            <hr />

            <div class="total-compra">
              <span>Total</span>
              <strong>Bs {{ carrito.total.toFixed(2) }}</strong>
            </div>

            <button
              class="btn btn-finalizar w-100 mt-4"
              @click="continuarCompra"
            >
              CONTINUAR CON LA COMPRA
              <i class="pi pi-arrow-right ms-2"></i>
            </button>

            <div class="compra-segura">
              <i class="pi pi-shield"></i>
              <span>Compra segura y atención personalizada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.carrito-seccion {
  max-width: 1050px;
  min-height: 450px;
  color: #49382e;
}

.encabezado-carrito {
  margin-bottom: 28px !important;
}

.encabezado-carrito h1 {
  font-family: "Playfair Display", serif;
  font-size: 30px;
  color: #49382e;
  margin: 10px 0;
}

.encabezado-carrito p {
  color: #8c8074;
  font-size: 12px;
}

.subtitulo {
  color: #a17e55;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 3px;
}

/* DISTRIBUCION: PRODUCTOS Y RESUMEN */
.carrito-seccion > .row {
  display: grid !important;
  grid-template-columns: minmax(0, 1.8fr) minmax(260px, 0.8fr);
  gap: 22px;
  margin: 0;
}

.carrito-seccion > .row > div {
  width: 100%;
  max-width: 100%;
  padding: 0;
}

/* TARJETA DEL PRODUCTO */
.producto-carrito {
  background: white;
  border: 1px solid #eee9e1 !important;
  border-radius: 0;
  overflow: hidden;
  margin-bottom: 14px !important;
}

.producto-carrito > .row {
  display: grid !important;
  grid-template-columns: 175px minmax(0, 1fr);
  margin: 0;
  align-items: center !important;
}

.producto-carrito > .row > div {
  width: 100%;
  max-width: 100%;
  padding: 0;
}

/* IMAGEN COMPLETA */
.imagen-carrito {
  width: 100%;
  height: 165px;
  min-height: 165px;
  max-height: 165px;
  background: #f5f0e8;
  overflow: hidden;
}

.imagen-carrito img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.imagen-sin-foto {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #aa9c8d;
  font-size: 11px;
}

.imagen-sin-foto i {
  font-size: 30px;
}

/* INFORMACION */
.producto-informacion {
  padding: 14px 17px;
}

.etiqueta {
  font-size: 8px;
  color: #a17e55;
  letter-spacing: 2px;
}

.producto-informacion h3 {
  font-family: "Playfair Display", serif;
  font-size: 18px;
  margin: 6px 0;
  color: #49382e;
}

.color-producto {
  font-size: 11px;
  color: #8c8074;
  margin-bottom: 6px;
}

.color-producto strong {
  color: #49382e;
}

.precio-unitario {
  color: #a17e55;
  font-weight: 700;
  font-size: 14px;
}

.cantidad-contenedor {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  font-size: 11px;
  color: #75685c;
}

.control-cantidad {
  display: flex;
  align-items: center;
  border: 1px solid #e3dcd2;
}

.control-cantidad button {
  width: 27px;
  height: 27px;
  border: none;
  background: #f5f0e8;
  color: #49382e;
  font-size: 16px;
  cursor: pointer;
}

.control-cantidad button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.control-cantidad span {
  min-width: 27px;
  text-align: center;
  font-size: 12px;
}

.subtotal {
  color: #49382e;
  font-size: 11px;
}

.btn-eliminar {
  border: none;
  background: transparent;
  color: #a35e4d;
  font-size: 10px;
  cursor: pointer;
}

.volver-tienda {
  display: inline-block;
  margin-top: 10px;
  color: #80684e;
  text-decoration: none;
  font-size: 11px;
}

/* RESUMEN LATERAL */
.resumen-compra {
  background: white;
  border: 1px solid #eee9e1 !important;
  border-radius: 0;
  position: sticky;
  top: 20px;
  height: fit-content;
}

.resumen-compra h2 {
  font-family: "Playfair Display", serif;
  font-size: 20px;
  margin: 10px 0 20px;
}

.linea-resumen {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 13px;
  font-size: 11px;
  color: #75685c;
}

.linea-resumen strong {
  color: #49382e;
}

.resumen-compra hr {
  border-color: #e3dcd2;
  opacity: 1;
  margin: 15px 0;
}

.total-compra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
}

.total-compra strong {
  color: #a17e55;
  font-size: 17px;
}

.btn-finalizar {
  background: #49382e;
  color: white;
  padding: 12px 7px;
  border: none;
  border-radius: 0;
  font-size: 10px;
}

.btn-finalizar:hover {
  background: #a17e55;
  color: white;
}

.compra-segura {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: #8c8074;
  font-size: 9px;
  margin-top: 15px;
  text-align: center;
}

.compra-segura i {
  color: #a17e55;
}

/* CARRITO VACIO */
.carrito-vacio {
  background: white;
  border: 1px solid #eee9e1 !important;
}

.icono-vacio {
  font-size: 40px;
  color: #ad8960;
  margin-bottom: 15px;
}

.carrito-vacio h2 {
  font-family: "Playfair Display", serif;
  font-size: 23px;
}

.carrito-vacio p {
  color: #8c8074;
  font-size: 12px;
}

.btn-cafe {
  background: #49382e;
  color: white;
  padding: 11px 20px;
  border-radius: 0;
  font-size: 12px;
}

/* TABLET Y CELULAR */
@media (max-width: 767px) {
  .carrito-seccion > .row {
    grid-template-columns: 1fr;
  }

  .producto-carrito > .row {
    grid-template-columns: 130px minmax(0, 1fr);
  }

  .imagen-carrito {
    height: 155px;
    min-height: 155px;
    max-height: 155px;
  }

  .producto-informacion {
    padding: 10px;
  }

  .resumen-compra {
    position: static;
  }
}

@media (max-width: 420px) {
  .producto-carrito > .row {
    grid-template-columns: 1fr;
  }

  .imagen-carrito {
    height: 190px;
    max-height: 190px;
  }
}
</style>
