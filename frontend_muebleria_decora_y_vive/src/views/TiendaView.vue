<script setup lang="ts">
import { ref, onMounted } from "vue";
import { listarProductos } from "@/services/productoService";
import { useCarritoStore } from "@/stores/carrito";

const carrito = useCarritoStore();

const productos = ref<any[]>([]);
const cargando = ref(true);
const error = ref("");

const coloresSeleccionados = ref<Record<number, number>>({});

onMounted(async () => {
  try {
    productos.value = await listarProductos();
  } catch {
    error.value = "No se pudieron cargar los productos.";
  } finally {
    cargando.value = false;
  }
});

function agregarAlCarrito(producto: any) {
  const idColor = coloresSeleccionados.value[producto.id_producto];

  const variante = producto.colores?.find(
    (item: any) => item.id_producto_color === idColor,
  );

  if (!variante) {
    alert("Selecciona un color disponible.");
    return;
  }

  if (!variante.color?.estado || variante.stock <= 0) {
    alert("Este color no tiene existencias disponibles.");
    return;
  }

  carrito.agregar({
    id_producto_color: variante.id_producto_color,
    id_producto: producto.id_producto,
    nombre: producto.nombre,
    fotografia: producto.fotografia || "",
    precio: Number(producto.precio),
    color: variante.color.nombre,
    cantidad: 1,
    stock: variante.stock,
  });
}
</script>

<template>
  <main class="tienda">
    <header class="encabezado">
      <h1>Mueblería Decora y Vive</h1>
      <p>Encuentra los muebles ideales para tu hogar</p>
    </header>

    <div class="titulo-catalogo">
      <h2>Nuestros productos</h2>

      <RouterLink to="/carrito" class="enlace-carrito">
        Mi carrito ({{ carrito.cantidadProductos }})
      </RouterLink>
    </div>

    <p v-if="cargando">Cargando productos...</p>
    <p v-else-if="error">{{ error }}</p>

    <div v-else class="catalogo">
      <article
        v-for="producto in productos"
        :key="producto.id_producto"
        class="producto"
      >
        <img
          v-if="producto.fotografia"
          :src="producto.fotografia"
          :alt="producto.nombre"
        />

        <div class="informacion">
          <h3>{{ producto.nombre }}</h3>
          <p>{{ producto.descripcion }}</p>

          <strong> Bs {{ Number(producto.precio).toFixed(2) }} </strong>

          <label>Selecciona un color:</label>

          <select v-model="coloresSeleccionados[producto.id_producto]">
            <option disabled :value="undefined">Seleccionar color</option>

            <option
              v-for="variante in producto.colores?.filter(
                (item: any) => item.color?.estado,
              ) || []"
              :key="variante.id_producto_color"
              :value="variante.id_producto_color"
              :disabled="variante.stock <= 0"
            >
              {{ variante.color.nombre }}
              - Stock: {{ variante.stock }}
            </option>
          </select>

          <button
            @click="agregarAlCarrito(producto)"
            :disabled="!producto.colores?.length"
          >
            Agregar al carrito
          </button>
        </div>
      </article>
    </div>
  </main>
</template>

<style scoped>
.tienda {
  padding: 30px;
}

.encabezado {
  padding: 45px 20px;
  text-align: center;
  background: #f1eafa;
  border-radius: 15px;
  margin-bottom: 30px;
}

.encabezado h1 {
  color: #7041a6;
  font-size: 32px;
}

.titulo-catalogo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.enlace-carrito {
  background: #7041a6;
  color: white;
  padding: 10px 18px;
  border-radius: 8px;
  text-decoration: none;
}

.catalogo {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 22px;
}

.producto {
  overflow: hidden;
  border-radius: 12px;
  background: white;
  box-shadow: 0 3px 12px #00000012;
}

.producto img {
  width: 100%;
  height: 210px;
  object-fit: cover;
}

.informacion {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.informacion strong {
  color: #7041a6;
  font-size: 19px;
}

select,
button {
  padding: 11px;
  border-radius: 8px;
}

select {
  border: 1px solid #ddd;
}

button {
  background: #7041a6;
  color: white;
  border: none;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
