<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { listarProductos } from "@/services/productoService";
import { listarCategorias } from "@/services/categoriaService";
import api from "@/services/api";
import { listarColores } from "@/services/colorService";

// Lista de productos
const productos = ref<any[]>([]);

// Estados
const cargando = ref(false);
const error = ref("");

// Lista de categorías disponibles
const categorias = ref<any[]>([]);

// Mostrar u ocultar el formulario
const mostrarFormulario = ref(false);

// Datos del nuevo producto
const nuevoProducto = ref({
  nombre: "",
  descripcion: "",
  precio: 0,
  fotografia: "",
  id_categoria: null as number | null,
});

// Mensaje de resultado
const mensaje = ref("");

// Controlar el modo de edición
const modoEdicion = ref(false);

// Guardar el ID del producto seleccionado
const idProductoEditar = ref<number | null>(null);

// Búsqueda por nombre
const busqueda = ref("");

// Colores disponibles
const coloresDisponibles = ref<any[]>([]);

// Filtrar productos por nombre
const productosFiltrados = computed(() => {
  return productos.value.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase().trim()),
  );
});

// Colores seleccionados para el producto
const coloresSeleccionados = ref<{ id_color: number | null; stock: number }[]>([
  {
    id_color: null,
    stock: 1,
  },
]);

// Agregar un segundo color
const agregarSegundoColor = () => {
  if (coloresSeleccionados.value.length < 2) {
    coloresSeleccionados.value.push({
      id_color: null,
      stock: 1,
    });
  }
};

// Quitar un color
const quitarColor = (indice: number) => {
  coloresSeleccionados.value.splice(indice, 1);
};

// Consultar productos
const cargarProductos = async () => {
  try {
    cargando.value = true;
    error.value = "";

    productos.value = await listarProductos();
  } catch (err) {
    console.error("Error al listar productos:", err);
    error.value = "No se pudieron cargar los productos";
  } finally {
    cargando.value = false;
  }
};

// Consultar categorías
const cargarCategorias = async () => {
  try {
    const respuesta = await listarCategorias();

    categorias.value = respuesta.filter(
      (categoria: any) => categoria.estado === true,
    );
  } catch (err) {
    console.error("Error al cargar categorías:", err);
  }
};

// Consultar colores activos
const cargarColores = async () => {
  try {
    const respuesta = await listarColores();

    coloresDisponibles.value = respuesta.filter(
      (color: any) => color.estado === true,
    );
  } catch (err) {
    console.error("Error al cargar colores:", err);
  }
};

// Registrar un producto
const registrarProducto = async () => {
  try {
    mensaje.value = "";

    // Validar que exista al menos un color
    if (coloresSeleccionados.value.length < 1) {
      mensaje.value = "Debe seleccionar al menos un color";
      return;
    }

    // Validar que todos los colores tengan sus datos
    const coloresValidos = coloresSeleccionados.value.every(
      (color) =>
        color.id_color !== null &&
        Number.isInteger(color.stock) &&
        color.stock >= 1,
    );

    if (!coloresValidos) {
      mensaje.value = "Seleccione los colores y registre un stock válido";
      return;
    }

    // Preparar los datos que recibirá NestJS
    const datosProducto = {
      ...nuevoProducto.value,
      colores: coloresSeleccionados.value.map((color) => ({
        id_color: color.id_color,
        stock: color.stock,
      })),
    };

    await api.post("/productos", datosProducto);

    mensaje.value = "Producto registrado correctamente";

    // Limpiar formulario
    nuevoProducto.value = {
      nombre: "",
      descripcion: "",
      precio: 0,
      fotografia: "",
      id_categoria: null,
    };

    coloresSeleccionados.value = [
      {
        id_color: null,
        stock: 1,
      },
    ];

    mostrarFormulario.value = false;

    await cargarProductos();
  } catch (err) {
    console.error("Error al registrar producto:", err);
    mensaje.value = "No se pudo registrar el producto";
  }
};

// Cargar los datos del producto seleccionado
const editarProducto = async (id: number) => {
  try {
    const respuesta = await api.get(`/productos/${id}`);

    const producto = respuesta.data;

    nuevoProducto.value = {
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: Number(producto.precio),
      fotografia: producto.fotografia || "",
      id_categoria: producto.categoria?.id_categoria ?? null,
    };

    // Recuperar los colores y sus existencias
    coloresSeleccionados.value = producto.colores.map((item: any) => ({
      id_color: item.color?.id_color ?? item.id_color,
      stock: item.stock,
    }));

    idProductoEditar.value = id;
    modoEdicion.value = true;
    mostrarFormulario.value = true;
    mensaje.value = "";
  } catch (err) {
    console.error("Error al cargar producto:", err);
    mensaje.value = "No se pudieron cargar los datos del producto";
  }
};
// Modificar un producto
const modificarProducto = async () => {
  try {
    mensaje.value = "";

    if (idProductoEditar.value === null) return;

    // Validar colores
    const coloresValidos = coloresSeleccionados.value.every(
      (color) =>
        color.id_color !== null &&
        Number.isInteger(color.stock) &&
        color.stock >= 1,
    );

    if (
      coloresSeleccionados.value.length < 1 ||
      coloresSeleccionados.value.length > 2 ||
      !coloresValidos
    ) {
      mensaje.value = "Seleccione entre uno y dos colores con stock válido";
      return;
    }

    // Primera operación: actualizar datos principales
    const datosProducto = {
      nombre: nuevoProducto.value.nombre,
      descripcion: nuevoProducto.value.descripcion,
      precio: nuevoProducto.value.precio,
      fotografia: nuevoProducto.value.fotografia,
      id_categoria: nuevoProducto.value.id_categoria,
    };

    await api.patch(`/productos/${idProductoEditar.value}`, datosProducto);

    // Segunda operación: actualizar colores y stock
    const datosColores = {
      colores: coloresSeleccionados.value.map((color) => ({
        id_color: color.id_color,
        stock: color.stock,
      })),
    };

    await api.patch(
      `/productos/${idProductoEditar.value}/colores`,
      datosColores,
    );

    mensaje.value = "Producto modificado correctamente";

    // Limpiar formulario
    nuevoProducto.value = {
      nombre: "",
      descripcion: "",
      precio: 0,
      fotografia: "",
      id_categoria: null,
    };

    coloresSeleccionados.value = [{ id_color: null, stock: 1 }];

    idProductoEditar.value = null;
    modoEdicion.value = false;
    mostrarFormulario.value = false;

    await cargarProductos();
  } catch (err) {
    console.error("Error al modificar producto:", err);
    mensaje.value = "No se pudo modificar el producto";
  }
};

// Ejecutar al abrir la pantalla
onMounted(() => {
  cargarProductos();
  cargarCategorias();
  cargarColores();
});
</script>

<template>
  <main class="p-4">
    <h1>Administración de Productos</h1>

    <p>Gestión de muebles disponibles para la venta.</p>

    <!-- Botón para mostrar el formulario -->
    <button @click="mostrarFormulario = !mostrarFormulario">
      Nuevo producto
    </button>

    <!-- Formulario de registro -->
    <div v-if="mostrarFormulario">
      <h2>{{ modoEdicion ? "Modificar producto" : "Registrar producto" }}</h2>

      <form
        @submit.prevent="
          modoEdicion ? modificarProducto() : registrarProducto()
        "
      >
        <div>
          <label>Nombre:</label>
          <input
            v-model="nuevoProducto.nombre"
            type="text"
            maxlength="150"
            required
          />
        </div>

        <div>
          <label>Descripción:</label>
          <textarea
            v-model="nuevoProducto.descripcion"
            maxlength="500"
          ></textarea>
        </div>

        <div>
          <label>Precio:</label>
          <input
            v-model.number="nuevoProducto.precio"
            type="number"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div>
          <label>Fotografía (URL):</label>
          <input
            v-model="nuevoProducto.fotografia"
            type="text"
            maxlength="500"
          />
        </div>

        <div>
          <label>Categoría:</label>
          <select v-model.number="nuevoProducto.id_categoria" required>
            <option :value="null" disabled>Seleccione una categoría</option>

            <option
              v-for="categoria in categorias"
              :key="categoria.id_categoria"
              :value="categoria.id_categoria"
            >
              {{ categoria.nombre }}
            </option>
          </select>
        </div>

        <!-- Selección de colores y stock -->
        <h3>Colores del producto</h3>

        <div v-for="(color, indice) in coloresSeleccionados" :key="indice">
          <h4>Color {{ indice + 1 }}</h4>

          <div>
            <label>Seleccionar color:</label>

            <select v-model.number="color.id_color" required>
              <option :value="null" disabled>Seleccione un color</option>

              <option
                v-for="disponible in coloresDisponibles"
                :key="disponible.id_color"
                :value="disponible.id_color"
                :disabled="
                  coloresSeleccionados.some(
                    (seleccionado, i) =>
                      i !== indice &&
                      seleccionado.id_color === disponible.id_color,
                  )
                "
              >
                {{ disponible.nombre }}
              </option>
            </select>
          </div>

          <div>
            <label>Stock:</label>

            <input
              v-model.number="color.stock"
              type="number"
              min="1"
              step="1"
              required
            />
          </div>

          <button
            v-if="coloresSeleccionados.length > 1"
            type="button"
            @click="quitarColor(indice)"
          >
            Quitar color
          </button>
        </div>

        <button
          v-if="coloresSeleccionados.length < 2"
          type="button"
          @click="agregarSegundoColor"
        >
          Agregar otro color
        </button>

        <button type="submit">
          {{ modoEdicion ? "Actualizar producto" : "Guardar producto" }}
        </button>

        <button type="button" @click="mostrarFormulario = false">
          Cancelar
        </button>
      </form>
    </div>

    <p v-if="mensaje">{{ mensaje }}</p>

    <!-- Buscar productos -->
    <div>
      <label>Buscar producto por nombre:</label>
      <input
        v-model="busqueda"
        type="text"
        placeholder="Escribe el nombre del producto..."
      />
    </div>

    <div v-if="cargando && productos.length === 0">Cargando productos...</div>

    <div v-if="error">
      {{ error }}
      <button @click="cargarProductos">Reintentar</button>
    </div>

    <div v-else>
      <table class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th>Fecha de registro</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="producto in productosFiltrados"
            :key="producto.id_producto"
          >
            <td>{{ producto.id_producto }}</td>
            <td>{{ producto.nombre }}</td>
            <td>{{ producto.descripcion || "-" }}</td>
            <td>{{ producto.precio }}</td>
            <td>{{ producto.categoria?.nombre || "-" }}</td>
            <td>{{ producto.estado ? "Activo" : "Eliminado" }}</td>
            <td>{{ producto.fecha_registro }}</td>
            <td>
              <button @click="editarProducto(producto.id_producto)">
                Editar
              </button>
            </td>
          </tr>

          <tr v-if="productosFiltrados.length === 0">
            <td colspan="8">No se encontraron productos.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped>
.tabla {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.tabla th,
.tabla td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.tabla th {
  background-color: #eee;
}

input {
  padding: 8px;
  margin: 10px;
}
</style>
