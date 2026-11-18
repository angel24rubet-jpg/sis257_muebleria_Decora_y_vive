<script setup lang="ts">
import { useRouter } from "vue-router";
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
  <main class="carrito">
    <h1>Mi carrito de compras</h1>

    <div v-if="!carrito.productos.length" class="vacio">
      <h2>Tu carrito está vacío</h2>
      <RouterLink to="/tienda">Continuar comprando</RouterLink>
    </div>

    <div v-else>
      <article
        v-for="producto in carrito.productos"
        :key="producto.id_producto_color"
        class="producto"
      >
        <img
          v-if="producto.fotografia"
          :src="producto.fotografia"
          :alt="producto.nombre"
        />

        <div class="informacion">
          <h3>{{ producto.nombre }}</h3>
          <p>Color: {{ producto.color }}</p>
          <div class="control-cantidad">
            <button
              @click="carrito.disminuir(producto.id_producto_color)"
              type="button"
            >
              −
            </button>

            <span>{{ producto.cantidad }}</span>

            <button
              @click="carrito.agregar(producto)"
              type="button"
              :disabled="producto.cantidad >= producto.stock"
            >
              +
            </button>
          </div>
          <p>Precio: Bs {{ producto.precio.toFixed(2) }}</p>
          <strong>
            Subtotal: Bs
            {{ (producto.precio * producto.cantidad).toFixed(2) }}
          </strong>

          <button @click="carrito.quitar(producto.id_producto_color)">
            Eliminar
          </button>
        </div>
      </article>

      <div class="resumen">
        <h2>Total: Bs {{ carrito.total.toFixed(2) }}</h2>

        <button @click="continuarCompra">Continuar con la compra</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.carrito {
  max-width: 1000px;
  margin: 35px auto;
  padding: 20px;
}

.producto {
  display: flex;
  gap: 20px;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 12px;
  box-shadow: 0 3px 12px #00000012;
}

.producto img {
  width: 150px;
  height: 130px;
  object-fit: cover;
  border-radius: 8px;
}

.informacion {
  flex: 1;
}

button {
  padding: 11px 18px;
  border: none;
  border-radius: 8px;
  background: #7041a6;
  color: white;
  cursor: pointer;
}

.resumen {
  text-align: right;
  margin-top: 30px;
}

.vacio {
  text-align: center;
  padding: 50px;
}

@media (max-width: 600px) {
  .producto {
    flex-direction: column;
  }
}

.control-cantidad {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 12px 0;
}

.control-cantidad button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #6c3b91;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.control-cantidad button:disabled {
  background: #aaa;
  cursor: not-allowed;
}

.control-cantidad span {
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}
</style>
