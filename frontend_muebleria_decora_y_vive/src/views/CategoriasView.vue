<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/services/api";

// Lista de categorias
const categorias = ref([]);

// Estado de carga
const cargando = ref(false);

// Mensaje de error
const error = ref("");

// Controlar el formulario
const mostrarFormulario = ref(false);

// Controlar el modo de edicion
const modoEdicion = ref(false);

// ID de la categoria que se modificara
const idCategoriaEditar = ref<number | null>(null);

// Datos del formulario
const formularioCategoria = ref({
  nombre: "",
  descripcion: "",
});

// Datos de la nueva categoria
const nuevaCategoria = ref({
  nombre: "",
  descripcion: "",
});

// Mensaje de resultado
const mensaje = ref("");

// Registrar una categoria
const registrarCategoria = async () => {
  try {
    mensaje.value = "";

    await api.post("/categorias", nuevaCategoria.value);

    mensaje.value = "Categoria registrada correctamente";

    nuevaCategoria.value = {
      nombre: "",
      descripcion: "",
    };

    mostrarFormulario.value = false;

    await listarCategorias();
  } catch (err) {
    console.error("Error al registrar categoria:", err);
    mensaje.value = "No se pudo registrar la categoria";
  }
};

// Recuperar los datos al presionar el boton editar
const editarCategoria = async (id: number) => {
  try {
    const respuesta = await api.get(`/categorias/${id}`);

    idCategoriaEditar.value = id;

    formularioCategoria.value = {
      nombre: respuesta.data.nombre,
      descripcion: respuesta.data.descripcion || "",
    };

    modoEdicion.value = true;
    mostrarFormulario.value = true;

    mensaje.value = "";
  } catch (err) {
    console.error("Error al recuperar categoria:", err);
    mensaje.value = "No se pudo recuperar la categoria";
  }
};

// Modificar una categoria
const modificarCategoria = async () => {
  try {
    if (idCategoriaEditar.value === null) return;

    await api.patch(
      `/categorias/${idCategoriaEditar.value}`,
      formularioCategoria.value,
    );

    mensaje.value = "Categoria modificada correctamente";

    // Cerrar y limpiar el formulario
    cancelarEdicion();

    // Actualizar la tabla
    await listarCategorias();
  } catch (err) {
    console.error("Error al modificar categoria:", err);
    mensaje.value = "No se pudo modificar la categoria";
  }
};

// Desactivar una categoria
const desactivarCategoria = async (id: number) => {
  try {
    const confirmar = window.confirm(
      "¿Estas seguro de desactivar esta categoria?",
    );

    if (!confirmar) return;

    await api.delete(`/categorias/${id}`);

    mensaje.value = "Categoria desactivada correctamente";

    await listarCategorias();
  } catch (err) {
    console.error("Error al desactivar categoria:", err);
    mensaje.value = "No se pudo desactivar la categoria";
  }
};

// Activar una categoria
const activarCategoria = async (id: number) => {
  try {
    await api.patch(`/categorias/${id}/estado`);

    mensaje.value = "Categoria activada correctamente";

    await listarCategorias();
  } catch (err) {
    console.error("Error al activar categoria:", err);
    mensaje.value = "No se pudo activar la categoria";
  }
};

// Cancelar la edicion
const cancelarEdicion = () => {
  modoEdicion.value = false;
  mostrarFormulario.value = false;
  idCategoriaEditar.value = null;

  formularioCategoria.value = {
    nombre: "",
    descripcion: "",
  };
};

// Consultar categorias del backend
const listarCategorias = async () => {
  try {
    cargando.value = true;
    error.value = "";

    const respuesta = await api.get("/categorias");
    categorias.value = respuesta.data;
  } catch (err) {
    console.error("Error al listar categorias:", err);
    error.value = "No se pudieron cargar las categorias";
  } finally {
    cargando.value = false;
  }
};

// Ejecutar al abrir la pantalla
onMounted(() => {
  listarCategorias();
});
</script>

<template>
  <main class="p-4">
    <h1>Administracion de Categorias</h1>

    <p>Gestion de categorias de productos.</p>

    <div v-if="cargando && categorias.length === 0">Cargando categorias...</div>

    <!-- Boton para abrir el formulario -->
    <button
      @click="
        cancelarEdicion();
        mostrarFormulario = true;
        nuevaCategoria = { nombre: '', descripcion: '' };
      "
    >
      Nueva categoria
    </button>

    <!-- Formulario de registro -->

    <div v-if="mostrarFormulario">
      <h2>
        {{ modoEdicion ? "Modificar categoria" : "Registrar categoria" }}
      </h2>

      <form
        @submit.prevent="
          modoEdicion ? modificarCategoria() : registrarCategoria()
        "
      >
        <div>
          <label>Nombre:</label>

          <input
            v-if="modoEdicion"
            v-model="formularioCategoria.nombre"
            type="text"
            maxlength="100"
            required
          />

          <input
            v-else
            v-model="nuevaCategoria.nombre"
            type="text"
            maxlength="100"
            required
          />
        </div>

        <div>
          <label>Descripcion:</label>

          <textarea
            v-if="modoEdicion"
            v-model="formularioCategoria.descripcion"
            maxlength="250"
          ></textarea>

          <textarea
            v-else
            v-model="nuevaCategoria.descripcion"
            maxlength="250"
          ></textarea>
        </div>

        <button type="submit">
          {{ modoEdicion ? "Guardar cambios" : "Registrar" }}
        </button>

        <button type="button" @click="cancelarEdicion">Cancelar</button>
      </form>
    </div>

    <!-- Mensaje de resultado -->
    <p v-if="mensaje">{{ mensaje }}</p>

    <!-- Mensaje de error -->
    <div v-if="error">
      {{ error }}
      <button @click="listarCategorias">Reintentar</button>
    </div>

    <!-- Tabla de categorias -->
    <div v-else>
      <table class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Estado</th>
            <th>Fecha de registro</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="categoria in categorias" :key="categoria.id_categoria">
            <td>{{ categoria.id_categoria }}</td>
            <td>{{ categoria.nombre }}</td>
            <td>{{ categoria.descripcion || "-" }}</td>
            <td>{{ categoria.estado ? "Activo" : "Inactivo" }}</td>
            <td>{{ categoria.fecha_registro }}</td>

            <td>
              <button
                v-if="categoria.estado === true"
                @click="desactivarCategoria(categoria.id_categoria)"
              >
                Desactivar
              </button>

              <button v-else @click="activarCategoria(categoria.id_categoria)">
                Activar
              </button>
            </td>

            <td>
              <button @click="editarCategoria(categoria.id_categoria)">
                Editar
              </button>
            </td>
          </tr>

          <tr v-if="categorias.length === 0">
            <td colspan="5">No existen categorias registradas.</td>
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
</style>
