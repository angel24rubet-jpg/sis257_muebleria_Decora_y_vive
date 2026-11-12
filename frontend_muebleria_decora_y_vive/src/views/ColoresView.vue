<script setup lang="ts">
import { ref, onMounted } from "vue";
import { listarColores } from "@/services/colorService";
import api from "@/services/api";

// Lista de colores
const colores = ref<any[]>([]);

// Estado de carga
const cargando = ref(false);

// Mensaje de error
const error = ref("");

// Controlar el formulario
const mostrarFormulario = ref(false);

// Datos del nuevo color
const nuevoColor = ref({
  nombre: "",
  codigo_hex: "#000000",
});

// Mensaje de resultado
const mensaje = ref("");

// Controlar el modo de edicion
const modoEdicion = ref(false);

// Guardar el ID del color seleccionado
const idColorEditar = ref<number | null>(null);

// Consultar colores del backend
const cargarColores = async () => {
  try {
    cargando.value = true;
    error.value = "";

    colores.value = await listarColores();
  } catch (err) {
    console.error("Error al listar colores:", err);
    error.value = "No se pudieron cargar los colores";
  } finally {
    cargando.value = false;
  }
};

// Registrar un color
const registrarColor = async () => {
  try {
    mensaje.value = "";

    await api.post("/colores", nuevoColor.value);

    mensaje.value = "Color registrado correctamente";

    nuevoColor.value = {
      nombre: "",
      codigo_hex: "#000000",
    };

    mostrarFormulario.value = false;

    await cargarColores();
  } catch (err) {
    console.error("Error al registrar color:", err);
    mensaje.value = "No se pudo registrar el color";
  }
};

// Cargar los datos del color seleccionado
const editarColor = async (id: number) => {
  try {
    const respuesta = await api.get(`/colores/${id}`);

    nuevoColor.value = {
      nombre: respuesta.data.nombre,
      codigo_hex: respuesta.data.codigo_hex || "#000000",
    };

    idColorEditar.value = id;
    modoEdicion.value = true;
    mostrarFormulario.value = true;
    mensaje.value = "";
  } catch (err) {
    console.error("Error al buscar color:", err);
    mensaje.value = "No se pudo cargar el color";
  }
};

// Guardar los cambios del color
const modificarColor = async () => {
  try {
    if (idColorEditar.value === null) return;

    await api.patch(`/colores/${idColorEditar.value}`, nuevoColor.value);

    mensaje.value = "Color modificado correctamente";

    nuevoColor.value = {
      nombre: "",
      codigo_hex: "#000000",
    };

    mostrarFormulario.value = false;
    modoEdicion.value = false;
    idColorEditar.value = null;

    await cargarColores();
  } catch (err) {
    console.error("Error al modificar color:", err);
    mensaje.value = "No se pudo modificar el color";
  }
};

// Activar o desactivar un color
const cambiarEstadoColor = async (id: number) => {
  try {
    mensaje.value = "";

    await api.patch(`/colores/${id}/estado`);

    mensaje.value = "Estado del color actualizado correctamente";

    await cargarColores();
  } catch (err) {
    console.error("Error al cambiar estado:", err);
    mensaje.value = "No se pudo cambiar el estado del color";
  }
};

// Ejecutar al abrir la pantalla
onMounted(() => {
  cargarColores();
});
</script>

<template>
  <main class="p-4">
    <h1>Administracion de Colores</h1>

    <button @click="mostrarFormulario = !mostrarFormulario">Nuevo color</button>

    <div v-if="mostrarFormulario">
      <h2>{{ modoEdicion ? "Modificar color" : "Registrar color" }}</h2>
      <form @submit.prevent="modoEdicion ? modificarColor() : registrarColor()">
        <div>
          <label>Nombre:</label>
          <input
            v-model="nuevoColor.nombre"
            type="text"
            maxlength="50"
            required
          />
        </div>

        <div>
          <label>Codigo hexadecimal:</label>
          <input v-model="nuevoColor.codigo_hex" type="color" />
        </div>

        <button type="submit">
          {{ modoEdicion ? "Actualizar" : "Guardar" }}
        </button>

        <button type="button" @click="mostrarFormulario = false">
          Cancelar
        </button>
      </form>
    </div>

    <p v-if="mensaje">{{ mensaje }}</p>

    <p>Gestion de colores disponibles para los productos.</p>

    <div v-if="cargando && colores.length === 0">Cargando colores...</div>

    <div v-if="error">
      {{ error }}
      <button @click="cargarColores">Reintentar</button>
    </div>

    <div v-else>
      <table class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Codigo hexadecimal</th>
            <th>Estado</th>
            <th>Fecha de registro</th>
            <th>Color</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="color in colores" :key="color.id_color">
            <td>{{ color.id_color }}</td>
            <td>{{ color.nombre }}</td>
            <td>{{ color.codigo_hex || "-" }}</td>
            <td>{{ color.estado ? "Activo" : "Inactivo" }}</td>
            <td>{{ color.fecha_registro }}</td>

            <td>
              <span
                v-if="color.codigo_hex"
                :style="{
                  display: 'inline-block',
                  width: '25px',
                  height: '25px',
                  backgroundColor: color.codigo_hex,
                  border: '1px solid #999',
                  borderRadius: '4px',
                }"
              ></span>
              <span v-else>-</span>
            </td>

            <td>
              <button @click="editarColor(color.id_color)">Editar</button>

              <button @click="cambiarEstadoColor(color.id_color)">
                {{ color.estado ? "Desactivar" : "Activar" }}
              </button>
            </td>
          </tr>

          <tr v-if="colores.length === 0">
            <td colspan="7">No existen colores registrados.</td>
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
