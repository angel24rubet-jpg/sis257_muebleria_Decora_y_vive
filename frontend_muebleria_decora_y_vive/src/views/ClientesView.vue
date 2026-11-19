<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import {
  listarClientes,
  registrarCliente,
  buscarCliente,
  modificarCliente,
  eliminarCliente,
} from "@/services/clienteService";

const clientes = ref<any[]>([]);
const cargando = ref(false);
const mensaje = ref("");
const error = ref("");
const busqueda = ref("");

const mostrarFormulario = ref(false);
const modoEdicion = ref(false);
const idCliente = ref<number | null>(null);

const nuevoCliente = ref({
  nombres: "",
  apellidos: "",
  ci: "",
  telefono: "",
  correo: "",
  direccion: "",
});

const clientesFiltrados = computed(() => {
  const termino = busqueda.value.toLowerCase().trim();

  return clientes.value.filter((cliente) =>
    [
      cliente.nombres,
      cliente.apellidos,
      cliente.ci,
      cliente.telefono,
      cliente.correo,
    ].some((dato) =>
      String(dato ?? "")
        .toLowerCase()
        .includes(termino),
    ),
  );
});

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

const abrirFormulario = () => {
  limpiarFormulario();
  mensaje.value = "";
  mostrarFormulario.value = true;
};

const cancelarFormulario = () => {
  limpiarFormulario();
  mostrarFormulario.value = false;
};

const cargarClientes = async () => {
  try {
    cargando.value = true;
    error.value = "";

    clientes.value = await listarClientes();
  } catch (err) {
    console.error("Error al cargar clientes:", err);
    error.value = "No se pudieron cargar los clientes.";
  } finally {
    cargando.value = false;
  }
};

const registrar = async () => {
  try {
    mensaje.value = "";

    await registrarCliente(nuevoCliente.value);

    mensaje.value = "Cliente registrado correctamente.";

    cancelarFormulario();
    await cargarClientes();
  } catch (err: any) {
    console.error("Error al registrar cliente:", err);

    mensaje.value =
      err.response?.data?.message ||
      "No se pudo registrar el cliente. Verifica el CI.";
  }
};

const editarCliente = async (id: number) => {
  try {
    mensaje.value = "";
    cargando.value = true;

    const cliente = await buscarCliente(id);

    if (!cliente || !cliente.id_cliente) {
      mensaje.value = "No se encontraron los datos del cliente.";
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
  } catch (err) {
    console.error("Error al obtener cliente:", err);
    mensaje.value = "No se pudo obtener el cliente.";
  } finally {
    cargando.value = false;
  }
};

const modificar = async () => {
  if (idCliente.value === null) {
    mensaje.value = "No se ha seleccionado un cliente.";
    return;
  }

  try {
    mensaje.value = "";

    await modificarCliente(idCliente.value, nuevoCliente.value);

    mensaje.value = "Cliente modificado correctamente.";

    cancelarFormulario();
    await cargarClientes();
  } catch (err: any) {
    console.error("Error al modificar cliente:", err);

    mensaje.value =
      err.response?.data?.message ||
      "No se pudo modificar el cliente. Verifica el CI.";
  }
};

const eliminar = async (id: number) => {
  const confirmar = window.confirm("¿Está seguro de eliminar este cliente?");

  if (!confirmar) return;

  try {
    mensaje.value = "";

    await eliminarCliente(id);

    mensaje.value = "Cliente eliminado correctamente.";

    await cargarClientes();
  } catch (err: any) {
    console.error("Error al eliminar cliente:", err);

    mensaje.value =
      err.response?.data?.message || "No se pudo eliminar el cliente.";
  }
};

const formatoFecha = (fecha: string) => {
  if (!fecha) return "-";

  const fechaValida = new Date(fecha);

  if (isNaN(fechaValida.getTime())) return fecha;

  return fechaValida.toLocaleDateString("es-BO");
};

onMounted(() => {
  cargarClientes();
});
</script>

<template>
  <main class="clientes-admin container-fluid py-3 px-3 px-lg-4">
    <!-- ENCABEZADO -->
    <div
      class="encabezado-admin d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"
    >
      <div>
        <span class="subtitulo-admin">GESTIÓN DE USUARIOS</span>
        <h1 class="titulo-admin">Administración de clientes</h1>
        <p class="descripcion-admin mb-0">
          Administra la información de los clientes de Decora y Vive.
        </p>
      </div>

      <button class="btn btn-nuevo" @click="abrirFormulario">
        <i class="pi pi-user-plus me-2"></i>
        Registrar cliente
      </button>
    </div>

    <!-- MENSAJES -->
    <div v-if="mensaje" class="alert alert-info mensaje-admin">
      {{ mensaje }}
      <button
        type="button"
        class="btn-close float-end"
        @click="mensaje = ''"
      ></button>
    </div>

    <div v-if="error" class="alert alert-danger mensaje-admin">
      {{ error }}
      <button
        class="btn btn-sm btn-outline-danger ms-2"
        @click="cargarClientes"
      >
        Reintentar
      </button>
    </div>

    <!-- FORMULARIO -->
    <section v-if="mostrarFormulario" class="formulario-admin card mb-4">
      <div
        class="formulario-header d-flex justify-content-between align-items-center"
      >
        <div>
          <span class="subtitulo-admin">INFORMACIÓN PERSONAL</span>
          <h2 class="formulario-titulo">
            {{ modoEdicion ? "Modificar cliente" : "Registrar nuevo cliente" }}
          </h2>
        </div>

        <button type="button" class="btn-cerrar" @click="cancelarFormulario">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <form @submit.prevent="modoEdicion ? modificar() : registrar()">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Nombres</label>
            <input
              v-model="nuevoCliente.nombres"
              type="text"
              class="form-control"
              placeholder="Ingrese los nombres"
              required
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">Apellidos</label>
            <input
              v-model="nuevoCliente.apellidos"
              type="text"
              class="form-control"
              placeholder="Ingrese los apellidos"
              required
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">Carnet de identidad</label>
            <input
              v-model="nuevoCliente.ci"
              type="text"
              class="form-control"
              placeholder="Ingrese el CI"
              required
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">Teléfono</label>
            <input
              v-model="nuevoCliente.telefono"
              type="text"
              class="form-control"
              placeholder="Ingrese el teléfono"
              required
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">Correo electrónico</label>
            <input
              v-model="nuevoCliente.correo"
              type="email"
              class="form-control"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">Dirección</label>
            <input
              v-model="nuevoCliente.direccion"
              type="text"
              class="form-control"
              placeholder="Ingrese la dirección"
              required
            />
          </div>

          <div class="col-12 d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              class="btn btn-cancelar"
              @click="cancelarFormulario"
            >
              Cancelar
            </button>

            <button type="submit" class="btn btn-guardar">
              <i class="pi pi-check me-2"></i>
              {{ modoEdicion ? "Guardar cambios" : "Registrar cliente" }}
            </button>
          </div>
        </div>
      </form>
    </section>

    <!-- LISTADO -->
    <section class="listado-admin card">
      <div
        class="listado-header d-flex flex-wrap justify-content-between align-items-center gap-3"
      >
        <div>
          <h2 class="listado-titulo">Clientes registrados</h2>
          <p class="texto-ayuda mb-0">Total: {{ clientes.length }} clientes</p>
        </div>

        <div class="buscador-clientes">
          <i class="pi pi-search"></i>
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por nombre, CI o correo..."
          />
        </div>
      </div>

      <!-- CARGANDO -->
      <div v-if="cargando" class="estado-vacio">
        <i class="pi pi-spin pi-spinner"></i>
        <p>Cargando clientes...</p>
      </div>

      <!-- TABLA -->
      <div v-else-if="!error" class="table-responsive">
        <table class="table tabla-clientes align-middle mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Origen</th>
              <th>CI</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Registro</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="cliente in clientesFiltrados"
              :key="
                cliente.origen === 'VIRTUAL'
                  ? 'V-' + cliente.id_usuario
                  : 'P-' + cliente.id_cliente
              "
            >
              <td class="id-cliente">
                {{
                  cliente.origen === "VIRTUAL"
                    ? "#U-" + cliente.id_usuario
                    : "#C-" + cliente.id_cliente
                }}
              </td>

              <td>
                <div class="cliente-info">
                  <span class="avatar-cliente">
                    <i class="pi pi-user"></i>
                  </span>

                  <span class="nombre-cliente">
                    {{ cliente.nombres }} {{ cliente.apellidos }}
                  </span>
                </div>
              </td>

              <td>
                <span
                  :class="
                    cliente.origen === 'VIRTUAL'
                      ? 'origen-virtual'
                      : 'origen-presencial'
                  "
                >
                  {{ cliente.origen }}
                </span>
              </td>

              <td>{{ cliente.ci || "-" }}</td>

              <td class="telefono-cliente">
                {{ cliente.telefono || "-" }}
              </td>

              <td class="correo-cliente">
                {{ cliente.correo || "-" }}
              </td>

              <td class="direccion-cliente">
                {{ cliente.direccion || "-" }}
              </td>

              <td>
                <span
                  :class="cliente.estado ? 'estado-activo' : 'estado-inactivo'"
                >
                  {{ cliente.estado ? "Activo" : "Inactivo" }}
                </span>
              </td>

              <td class="fecha-cliente">
                {{ formatoFecha(cliente.fecha_registro) }}
              </td>

              <td>
                <div
                  v-if="cliente.origen === 'PRESENCIAL'"
                  class="acciones-cliente"
                >
                  <button
                    class="btn-accion btn-editar"
                    title="Editar cliente"
                    @click="editarCliente(cliente.id_cliente)"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>

                  <button
                    class="btn-accion btn-eliminar"
                    title="Eliminar cliente"
                    @click="eliminar(cliente.id_cliente)"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </div>

                <span v-else class="texto-virtual">Cuenta virtual</span>
              </td>
            </tr>

            <tr v-if="clientesFiltrados.length === 0">
              <td colspan="10" class="sin-resultados">
                <i class="pi pi-search"></i>
                <p class="mb-0">No se encontraron clientes.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<style scoped>
.clientes-admin {
  max-width: 1500px;
  margin: 0 auto;
  color: #453329;
}

.subtitulo-admin {
  color: #a17b4d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
}

.titulo-admin {
  color: #493326;
  font-family: "Playfair Display", Georgia, serif;
  font-size: 27px;
  font-weight: 700;
  margin: 5px 0;
}

.descripcion-admin,
.texto-ayuda {
  color: #8b7b70;
  font-size: 12px;
}

.btn-nuevo,
.btn-guardar {
  background: #634632;
  border: 1px solid #634632;
  border-radius: 6px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 10px 16px;
}

.btn-nuevo:hover,
.btn-guardar:hover {
  background: #806044;
  border-color: #806044;
  color: white;
}

.mensaje-admin {
  font-size: 12px;
  padding: 10px 14px;
  border-radius: 6px;
}

.formulario-admin,
.listado-admin {
  border: 1px solid #e9dfd3;
  border-radius: 9px;
  box-shadow: 0 3px 12px rgba(70, 48, 32, 0.05);
  overflow: hidden;
}

.formulario-admin {
  padding: 20px;
  background: #fffdfa;
}

.formulario-header {
  margin-bottom: 18px;
}

.formulario-titulo {
  color: #493326;
  font-family: "Playfair Display", Georgia, serif;
  font-size: 20px;
  margin: 4px 0 0;
}

.btn-cerrar {
  width: 31px;
  height: 31px;
  border: 1px solid #e7dbce;
  border-radius: 50%;
  background: white;
  color: #74583e;
}

.form-label {
  color: #5e4939;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 5px;
}

.form-control {
  min-height: 36px;
  border: 1px solid #e4d9cd;
  border-radius: 5px;
  color: #493326;
  font-size: 12px;
  box-shadow: none;
}

.form-control:focus {
  border-color: #a17b4d;
  box-shadow: 0 0 0 2px rgba(161, 123, 77, 0.12);
}

.btn-cancelar {
  border: 1px solid #d8cabb;
  border-radius: 5px;
  background: white;
  color: #634632;
  font-size: 11px;
  padding: 9px 15px;
}

.btn-guardar {
  font-size: 11px;
  padding: 9px 15px;
}

.listado-header {
  padding: 17px 18px;
  border-bottom: 1px solid #eee5db;
}

.listado-titulo {
  color: #493326;
  font-family: "Playfair Display", Georgia, serif;
  font-size: 19px;
  font-weight: 700;
  margin: 0 0 4px;
}

.buscador-clientes {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 290px;
  padding: 8px 11px;
  border: 1px solid #e6dbcf;
  border-radius: 5px;
  background: #fffdfa;
  color: #987c60;
}

.buscador-clientes input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #493326;
  font-size: 11px;
}

.tabla-clientes {
  min-width: 1150px;
  font-size: 11px;
}

.tabla-clientes thead th {
  padding: 12px 10px;
  background: #f6f0e8;
  color: #634632;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  border-bottom: 1px solid #e9dfd3;
}

.tabla-clientes tbody td {
  padding: 10px;
  color: #66564a;
  border-bottom: 1px solid #f0e9e1;
}

.tabla-clientes tbody tr:hover {
  background: #fdfaf6;
}

.id-cliente {
  color: #a17b4d !important;
  font-weight: 700;
}

.cliente-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 160px;
}

.avatar-cliente {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #f3eadf;
  color: #89643e;
}

.nombre-cliente {
  color: #493326;
  font-weight: 700;
}

.telefono-cliente,
.fecha-cliente {
  white-space: nowrap;
}

.correo-cliente {
  min-width: 150px;
}

.direccion-cliente {
  min-width: 130px;
  max-width: 180px;
}

.estado-activo,
.estado-inactivo {
  display: inline-block;
  border-radius: 20px;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 600;
}

.estado-activo {
  background: #eaf3e9;
  color: #47744b;
}

.estado-inactivo {
  background: #f7e9e6;
  color: #a14f42;
}

.origen-virtual,
.origen-presencial {
  display: inline-block;
  padding: 4px 9px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.origen-virtual {
  background: #eee8f7;
  color: #7041a6;
}

.origen-presencial {
  background: #eaf3e9;
  color: #47744b;
}

.texto-virtual {
  color: #8b7b70;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.acciones-cliente {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.btn-accion {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 5px;
  font-size: 11px;
}

.btn-editar {
  border: 1px solid #e5d4bd;
  background: #faf3e8;
  color: #89643e;
}

.btn-eliminar {
  border: 1px solid #efd5d1;
  background: #fff2f0;
  color: #ad5549;
}

.btn-editar:hover {
  background: #89643e;
  color: white;
}

.btn-eliminar:hover {
  background: #ad5549;
  color: white;
}

.estado-vacio,
.sin-resultados {
  padding: 35px 15px !important;
  text-align: center;
  color: #9a8776 !important;
  font-size: 12px;
}

.estado-vacio i,
.sin-resultados i {
  font-size: 20px;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .titulo-admin {
    font-size: 23px;
  }

  .formulario-admin {
    padding: 14px;
  }

  .buscador-clientes {
    width: 100%;
  }

  .listado-header {
    align-items: stretch !important;
  }
}
</style>
