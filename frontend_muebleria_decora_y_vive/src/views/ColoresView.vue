<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { listarColores } from "@/services/colorService";
import api from "@/services/api";

const colores = ref<any[]>([]);
const cargando = ref(false);
const error = ref("");
const mensaje = ref("");
const busqueda = ref("");

const mostrarFormulario = ref(false);
const modoEdicion = ref(false);
const idColorEditar = ref<number | null>(null);

const nuevoColor = ref({
  nombre: "",
  codigo_hex: "#000000",
});

const coloresFiltrados = computed(() => {
  const termino = busqueda.value.toLowerCase().trim();

  return colores.value.filter((color) =>
    color.nombre?.toLowerCase().includes(termino),
  );
});

const cargarColores = async () => {
  try {
    cargando.value = true;
    error.value = "";

    colores.value = await listarColores();
  } catch (err) {
    console.error("Error al listar colores:", err);
    error.value = "No se pudieron cargar los colores.";
  } finally {
    cargando.value = false;
  }
};

const limpiarFormulario = () => {
  nuevoColor.value = {
    nombre: "",
    codigo_hex: "#000000",
  };

  modoEdicion.value = false;
  idColorEditar.value = null;
};

const abrirNuevoFormulario = () => {
  limpiarFormulario();
  mensaje.value = "";
  mostrarFormulario.value = true;
};

const cancelarFormulario = () => {
  limpiarFormulario();
  mostrarFormulario.value = false;
};

const registrarColor = async () => {
  try {
    mensaje.value = "";

    await api.post("/colores", nuevoColor.value);

    mensaje.value = "Color registrado correctamente.";

    cancelarFormulario();
    await cargarColores();
  } catch (err) {
    console.error("Error al registrar color:", err);
    mensaje.value = "No se pudo registrar el color.";
  }
};

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
    mensaje.value = "No se pudo cargar el color.";
  }
};

const modificarColor = async () => {
  try {
    if (idColorEditar.value === null) return;

    await api.patch(`/colores/${idColorEditar.value}`, nuevoColor.value);

    mensaje.value = "Color modificado correctamente.";

    cancelarFormulario();
    await cargarColores();
  } catch (err) {
    console.error("Error al modificar color:", err);
    mensaje.value = "No se pudo modificar el color.";
  }
};

const cambiarEstadoColor = async (id: number) => {
  const color = colores.value.find((item) => item.id_color === id);

  const accion = color?.estado ? "desactivar" : "activar";

  if (!window.confirm(`¿Está seguro de ${accion} este color?`)) return;

  try {
    mensaje.value = "";

    await api.patch(`/colores/${id}/estado`);

    mensaje.value = `Color ${accion === "activar" ? "activado" : "desactivado"} correctamente.`;

    await cargarColores();
  } catch (err) {
    console.error("Error al cambiar estado:", err);
    mensaje.value = "No se pudo cambiar el estado del color.";
  }
};

const formatoFecha = (fecha: string) => {
  if (!fecha) return "-";

  const fechaValida = new Date(fecha);

  if (isNaN(fechaValida.getTime())) return fecha;

  return fechaValida.toLocaleDateString("es-BO");
};

onMounted(() => {
  cargarColores();
});
</script>

<template>
  <main class="colores-admin container-fluid py-3 px-3 px-lg-4">
    <!-- ENCABEZADO -->
    <div
      class="encabezado-admin d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"
    >
      <div>
        <span class="subtitulo-admin">PERSONALIZACIÓN DE MUEBLES</span>
        <h1 class="titulo-admin">Administración de colores</h1>
        <p class="descripcion-admin mb-0">
          Gestiona los colores disponibles para tus productos.
        </p>
      </div>

      <button class="btn btn-nuevo" @click="abrirNuevoFormulario">
        <i class="pi pi-plus me-2"></i>
        Nuevo color
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
      <button class="btn btn-sm btn-outline-danger ms-2" @click="cargarColores">
        Reintentar
      </button>
    </div>

    <!-- FORMULARIO -->
    <section v-if="mostrarFormulario" class="formulario-admin card mb-4">
      <div
        class="formulario-header d-flex justify-content-between align-items-center"
      >
        <div>
          <span class="subtitulo-admin">DATOS DEL COLOR</span>
          <h2 class="formulario-titulo">
            {{ modoEdicion ? "Modificar color" : "Registrar color" }}
          </h2>
        </div>

        <button type="button" class="btn-cerrar" @click="cancelarFormulario">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <form @submit.prevent="modoEdicion ? modificarColor() : registrarColor()">
        <div class="row g-3 align-items-end">
          <div class="col-md-5">
            <label class="form-label">Nombre del color</label>
            <input
              v-model="nuevoColor.nombre"
              type="text"
              class="form-control"
              maxlength="50"
              placeholder="Ej. Beige"
              required
            />
          </div>

          <div class="col-md-4">
            <label class="form-label">Código hexadecimal</label>
            <div class="selector-color">
              <input
                v-model="nuevoColor.codigo_hex"
                type="color"
                class="selector-hex"
                title="Seleccionar color"
              />
              <span class="codigo-hex">
                {{ nuevoColor.codigo_hex.toUpperCase() }}
              </span>
            </div>
          </div>

          <div class="col-md-3">
            <label class="form-label">Vista previa</label>
            <div class="vista-previa">
              <span
                class="muestra-color"
                :style="{ backgroundColor: nuevoColor.codigo_hex }"
              ></span>
              <span>{{ nuevoColor.nombre || "Nuevo color" }}</span>
            </div>
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
              {{ modoEdicion ? "Guardar cambios" : "Registrar color" }}
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
          <h2 class="listado-titulo">Colores registrados</h2>
          <p class="texto-ayuda mb-0">Total: {{ colores.length }} colores</p>
        </div>

        <div class="buscador-colores">
          <i class="pi pi-search"></i>
          <input v-model="busqueda" type="text" placeholder="Buscar color..." />
        </div>
      </div>

      <!-- CARGANDO -->
      <div v-if="cargando" class="estado-vacio">
        <i class="pi pi-spin pi-spinner"></i>
        <p>Cargando colores...</p>
      </div>

      <!-- TABLA -->
      <div v-else-if="!error" class="table-responsive">
        <table class="table tabla-colores align-middle mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Color</th>
              <th>Código hexadecimal</th>
              <th>Estado</th>
              <th>Fecha de registro</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="color in coloresFiltrados" :key="color.id_color">
              <td class="id-color">#{{ color.id_color }}</td>

              <td>
                <div class="nombre-color">
                  <span
                    class="muestra-tabla"
                    :style="{
                      backgroundColor: color.codigo_hex || '#ffffff',
                    }"
                  ></span>
                  <span>{{ color.nombre }}</span>
                </div>
              </td>

              <td>
                <span class="codigo-tabla">
                  {{ color.codigo_hex || "-" }}
                </span>
              </td>

              <td>
                <span
                  :class="color.estado ? 'estado-activo' : 'estado-inactivo'"
                >
                  {{ color.estado ? "Activo" : "Inactivo" }}
                </span>
              </td>

              <td class="fecha-color">
                {{ formatoFecha(color.fecha_registro) }}
              </td>

              <td>
                <div class="acciones-color">
                  <button
                    class="btn-accion btn-editar"
                    title="Editar color"
                    @click="editarColor(color.id_color)"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>

                  <button
                    v-if="color.estado"
                    class="btn-accion btn-desactivar"
                    title="Desactivar color"
                    @click="cambiarEstadoColor(color.id_color)"
                  >
                    <i class="pi pi-ban"></i>
                  </button>

                  <button
                    v-else
                    class="btn-accion btn-activar"
                    title="Activar color"
                    @click="cambiarEstadoColor(color.id_color)"
                  >
                    <i class="pi pi-check"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="coloresFiltrados.length === 0">
              <td colspan="6" class="sin-resultados">
                <i class="pi pi-search"></i>
                <p class="mb-0">No se encontraron colores.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<style scoped>
.colores-admin {
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

.selector-color {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 36px;
  padding: 4px 10px;
  border: 1px solid #e4d9cd;
  border-radius: 5px;
  background: white;
}

.selector-hex {
  width: 40px;
  height: 27px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.codigo-hex {
  color: #634632;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}

.vista-previa {
  display: flex;
  align-items: center;
  gap: 9px;
  height: 36px;
  padding: 4px 10px;
  border: 1px solid #e4d9cd;
  border-radius: 5px;
  background: #faf7f2;
  color: #634632;
  font-size: 11px;
}

.muestra-color,
.muestra-tabla {
  display: inline-block;
  width: 25px;
  height: 25px;
  border: 1px solid #d8cabb;
  border-radius: 5px;
  flex-shrink: 0;
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

.buscador-colores {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 250px;
  padding: 8px 11px;
  border: 1px solid #e6dbcf;
  border-radius: 5px;
  background: #fffdfa;
  color: #987c60;
}

.buscador-colores input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #493326;
  font-size: 11px;
}

.tabla-colores {
  min-width: 750px;
  font-size: 11px;
}

.tabla-colores thead th {
  padding: 12px 10px;
  background: #f6f0e8;
  color: #634632;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  border-bottom: 1px solid #e9dfd3;
}

.tabla-colores tbody td {
  padding: 11px 10px;
  color: #66564a;
  border-bottom: 1px solid #f0e9e1;
}

.tabla-colores tbody tr:hover {
  background: #fdfaf6;
}

.id-color {
  color: #a17b4d !important;
  font-weight: 700;
}

.nombre-color {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #493326;
  font-weight: 700;
}

.codigo-tabla {
  color: #806044;
  font-weight: 600;
  letter-spacing: 1px;
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

.fecha-color {
  white-space: nowrap;
}

.acciones-color {
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

.btn-desactivar {
  border: 1px solid #efd5d1;
  background: #fff2f0;
  color: #ad5549;
}

.btn-activar {
  border: 1px solid #d5e5d3;
  background: #edf6ec;
  color: #47744b;
}

.btn-editar:hover {
  background: #89643e;
  color: white;
}

.btn-desactivar:hover {
  background: #ad5549;
  color: white;
}

.btn-activar:hover {
  background: #47744b;
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

  .buscador-colores {
    width: 100%;
  }

  .listado-header {
    align-items: stretch !important;
  }
}
</style>
