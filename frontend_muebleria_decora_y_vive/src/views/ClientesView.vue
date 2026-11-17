<script setup lang="ts">
import { ref, onMounted } from "vue";

import {
  listarClientes,
  registrarCliente,
  buscarCliente,
  modificarCliente,
  eliminarCliente,
} from "@/services/clienteService";

// Variables principales
const clientes = ref<any[]>([]);
const cargando = ref(false);
const mensaje = ref("");
const mostrarFormulario = ref(false);
const modoEdicion = ref(false);
const idCliente = ref<number | null>(null);

// Datos del formulario
const nuevoCliente = ref({
  nombres: "",
  apellidos: "",
  ci: "",
  telefono: "",
  correo: "",
  direccion: "",
});

// Limpiar formulario
const limpiarFormulario = () => {
  nuevoCliente.value = {
    nombres: "",
    apellidos: "",
    ci: "",
    telefono: "",
    correo: "",
    direccion: "",
  };

  idCliente.value = null;
  modoEdicion.value = false;
};

// Abrir formulario para registrar
const abrirFormulario = () => {
  limpiarFormulario();
  mensaje.value = "";
  mostrarFormulario.value = true;
};

// Cancelar formulario
const cancelarFormulario = () => {
  limpiarFormulario();
  mostrarFormulario.value = false;
};

// Cargar clientes
const cargarClientes = async () => {
  try {
    cargando.value = true;

    clientes.value = await listarClientes();
  } catch (error) {
    console.error("Error al cargar clientes:", error);
    mensaje.value = "No se pudieron cargar los clientes";
  } finally {
    cargando.value = false;
  }
};

// Registrar cliente
const registrar = async () => {
  try {
    mensaje.value = "";

    await registrarCliente(nuevoCliente.value);

    mensaje.value = "Cliente registrado correctamente";

    limpiarFormulario();
    mostrarFormulario.value = false;

    await cargarClientes();
  } catch (error: any) {
    console.error("Error al registrar cliente:", error);

    mensaje.value =
      error.response?.data?.message ||
      "No se pudo registrar el cliente. Verifica el CI.";
  }
};

// Buscar cliente para editar
const editarCliente = async (id: number) => {
  try {
    mensaje.value = "";
    cargando.value = true;

    const cliente = await buscarCliente(id);

    if (!cliente || !cliente.id_cliente) {
      mensaje.value = "No se encontraron los datos del cliente";
      return;
    }

    idCliente.value = cliente.id_cliente;

    nuevoCliente.value = {
      nombres: cliente.nombres ?? "",
      apellidos: cliente.apellidos ?? "",
      ci: cliente.ci ?? "",
      telefono: cliente.telefono ?? "",
      correo: cliente.correo ?? "",
      direccion: cliente.direccion ?? "",
    };

    modoEdicion.value = true;
    mostrarFormulario.value = true;
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    mensaje.value = "No se pudo obtener el cliente";
  } finally {
    cargando.value = false;
  }
};

// Modificar cliente
const modificar = async () => {
  if (idCliente.value === null) {
    mensaje.value = "No se ha seleccionado un cliente";
    return;
  }

  try {
    mensaje.value = "";

    await modificarCliente(idCliente.value, nuevoCliente.value);

    mensaje.value = "Cliente modificado correctamente";

    limpiarFormulario();
    mostrarFormulario.value = false;

    await cargarClientes();
  } catch (error: any) {
    console.error("Error al modificar cliente:", error);

    mensaje.value =
      error.response?.data?.message ||
      "No se pudo modificar el cliente. Verifica el CI.";
  }
};

// Eliminar cliente
const eliminar = async (id: number) => {
  const confirmar = confirm("¿Está seguro de eliminar este cliente?");

  if (!confirmar) return;

  try {
    mensaje.value = "";

    await eliminarCliente(id);

    mensaje.value = "Cliente eliminado correctamente";

    await cargarClientes();
  } catch (error: any) {
    console.error("Error al eliminar cliente:", error);

    mensaje.value =
      error.response?.data?.message || "No se pudo eliminar el cliente";
  }
};

// Cargar datos al iniciar
onMounted(() => {
  cargarClientes();
});
</script>

<template>
  <div class="container-fluid p-4">
    <h2>Gestión de Clientes</h2>
    <p>Administra los clientes de Mueblería Decora y Vive.</p>

    <!-- Boton registrar -->
    <button class="btn btn-primary" @click="abrirFormulario">
      Registrar cliente
    </button>

    <!-- Formulario -->
    <div v-if="mostrarFormulario" class="card p-4 mt-3">
      <h4>
        {{ modoEdicion ? "Modificar cliente" : "Registrar nuevo cliente" }}
      </h4>

      <form @submit.prevent="modoEdicion ? modificar() : registrar()">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label>Nombres</label>
            <input
              v-model="nuevoCliente.nombres"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="col-md-6 mb-3">
            <label>Apellidos</label>
            <input
              v-model="nuevoCliente.apellidos"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="col-md-6 mb-3">
            <label>Carnet de identidad</label>
            <input
              v-model="nuevoCliente.ci"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="col-md-6 mb-3">
            <label>Teléfono</label>
            <input
              v-model="nuevoCliente.telefono"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="col-md-6 mb-3">
            <label>Correo electrónico</label>
            <input
              v-model="nuevoCliente.correo"
              type="email"
              class="form-control"
              required
            />
          </div>

          <div class="col-md-6 mb-3">
            <label>Dirección</label>
            <input
              v-model="nuevoCliente.direccion"
              type="text"
              class="form-control"
              required
            />
          </div>
        </div>

        <button type="submit" class="btn btn-success">
          {{ modoEdicion ? "Guardar cambios" : "Guardar cliente" }}
        </button>

        <button
          type="button"
          class="btn btn-secondary ms-2"
          @click="cancelarFormulario"
        >
          Cancelar
        </button>
      </form>
    </div>

    <!-- Mensajes -->
    <div v-if="mensaje" class="alert alert-info mt-3">
      {{ mensaje }}
    </div>

    <div v-if="cargando" class="mt-3">Cargando clientes...</div>

    <!-- Tabla -->
    <div class="table-responsive">
      <table class="table table-bordered table-striped mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>CI</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Fecha de registro</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="cliente in clientes" :key="cliente.id_cliente">
            <td>{{ cliente.id_cliente }}</td>
            <td>{{ cliente.nombres }}</td>
            <td>{{ cliente.apellidos }}</td>
            <td>{{ cliente.ci }}</td>
            <td>{{ cliente.telefono }}</td>
            <td>{{ cliente.correo }}</td>
            <td>{{ cliente.direccion }}</td>
            <td>
              {{ cliente.estado ? "Activo" : "Inactivo" }}
            </td>
            <td>{{ cliente.fecha_registro }}</td>

            <td>
              <button
                class="btn btn-warning btn-sm me-2"
                @click="editarCliente(cliente.id_cliente)"
              >
                Editar
              </button>

              <button
                class="btn btn-danger btn-sm"
                @click="eliminar(cliente.id_cliente)"
              >
                Eliminar
              </button>
            </td>
          </tr>

          <tr v-if="!cargando && clientes.length === 0">
            <td colspan="10" class="text-center">
              No hay clientes registrados.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
