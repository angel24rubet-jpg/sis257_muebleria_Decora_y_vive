<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import api from "@/services/api";

const categorias = ref<any[]>([]);
const cargando = ref(false);
const error = ref("");
const mensaje = ref("");
const busqueda = ref("");

const mostrarFormulario = ref(false);
const modoEdicion = ref(false);
const idCategoriaEditar = ref<number | null>(null);

const formularioCategoria = ref({
  nombre: "",
  descripcion: "",
});

const nuevaCategoria = ref({
  nombre: "",
  descripcion: "",
});

const categoriasFiltradas = computed(() => {
  const termino = busqueda.value.toLowerCase().trim();

  return categorias.value.filter((categoria) =>
    categoria.nombre?.toLowerCase().includes(termino),
  );
});

const listarCategorias = async () => {
  try {
    cargando.value = true;
    error.value = "";

    const respuesta = await api.get("/categorias");
    categorias.value = respuesta.data;
  } catch (err) {
    console.error("Error al listar categorias:", err);
    error.value = "No se pudieron cargar las categorias.";
  } finally {
    cargando.value = false;
  }
};

const limpiarFormulario = () => {
  modoEdicion.value = false;
  idCategoriaEditar.value = null;

  formularioCategoria.value = {
    nombre: "",
    descripcion: "",
  };

  nuevaCategoria.value = {
    nombre: "",
    descripcion: "",
  };
};

const abrirNuevoFormulario = () => {
  limpiarFormulario();
  mensaje.value = "";
  mostrarFormulario.value = true;
};

const cancelarEdicion = () => {
  limpiarFormulario();
  mostrarFormulario.value = false;
};

const registrarCategoria = async () => {
  try {
    mensaje.value = "";

    await api.post("/categorias", nuevaCategoria.value);

    mensaje.value = "Categoria registrada correctamente.";

    cancelarEdicion();
    await listarCategorias();
  } catch (err) {
    console.error("Error al registrar categoria:", err);
    mensaje.value = "No se pudo registrar la categoria.";
  }
};

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
    mensaje.value = "No se pudo recuperar la categoria.";
  }
};

const modificarCategoria = async () => {
  try {
    if (idCategoriaEditar.value === null) return;

    await api.patch(
      `/categorias/${idCategoriaEditar.value}`,
      formularioCategoria.value,
    );

    mensaje.value = "Categoria modificada correctamente.";

    cancelarEdicion();
    await listarCategorias();
  } catch (err) {
    console.error("Error al modificar categoria:", err);
    mensaje.value = "No se pudo modificar la categoria.";
  }
};

const desactivarCategoria = async (id: number) => {
  const confirmar = window.confirm(
    "¿Estas seguro de desactivar esta categoria?",
  );

  if (!confirmar) return;

  try {
    mensaje.value = "";

    await api.delete(`/categorias/${id}`);

    mensaje.value = "Categoria desactivada correctamente.";

    await listarCategorias();
  } catch (err) {
    console.error("Error al desactivar categoria:", err);
    mensaje.value = "No se pudo desactivar la categoria.";
  }
};

const activarCategoria = async (id: number) => {
  try {
    mensaje.value = "";

    await api.patch(`/categorias/${id}/estado`);

    mensaje.value = "Categoria activada correctamente.";

    await listarCategorias();
  } catch (err) {
    console.error("Error al activar categoria:", err);
    mensaje.value = "No se pudo activar la categoria.";
  }
};

const formatoFecha = (fecha: string) => {
  if (!fecha) return "-";

  const fechaValida = new Date(fecha);

  if (isNaN(fechaValida.getTime())) return fecha;

  return fechaValida.toLocaleDateString("es-BO");
};

onMounted(() => {
  listarCategorias();
});
</script>

<template>
  <main class="categorias-admin container-fluid py-3 px-3 px-lg-4">
    <!-- ENCABEZADO -->
    <div
      class="encabezado-admin d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"
    >
      <div>
        <span class="subtitulo-admin">ORGANIZACIÓN DE PRODUCTOS</span>
        <h1 class="titulo-admin">Administración de categorías</h1>
        <p class="descripcion-admin mb-0">
          Organiza y administra las categorías de tu mueblería.
        </p>
      </div>

      <button class="btn btn-nuevo" @click="abrirNuevoFormulario">
        <i class="pi pi-plus me-2"></i>
        Nueva categoría
      </button>
    </div>

    <!-- MENSAJE -->
    <div v-if="mensaje" class="alert alert-info mensaje-admin">
      {{ mensaje }}
      <button
        type="button"
        class="btn-close float-end"
        @click="mensaje = ''"
      ></button>
    </div>

    <!-- ERROR -->
    <div v-if="error" class="alert alert-danger mensaje-admin">
      {{ error }}
      <button
        class="btn btn-sm btn-outline-danger ms-2"
        @click="listarCategorias"
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
          <span class="subtitulo-admin">DATOS DE LA CATEGORÍA</span>
          <h2 class="formulario-titulo">
            {{ modoEdicion ? "Modificar categoría" : "Registrar categoría" }}
          </h2>
        </div>

        <button type="button" class="btn-cerrar" @click="cancelarEdicion">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <form
        @submit.prevent="
          modoEdicion ? modificarCategoria() : registrarCategoria()
        "
      >
        <div class="row g-3">
          <div class="col-md-5">
            <label class="form-label">Nombre de la categoría</label>
            <input
              v-if="modoEdicion"
              v-model="formularioCategoria.nombre"
              type="text"
              class="form-control"
              maxlength="100"
              placeholder="Ej. Dormitorios"
              required
            />

            <input
              v-else
              v-model="nuevaCategoria.nombre"
              type="text"
              class="form-control"
              maxlength="100"
              placeholder="Ej. Dormitorios"
              required
            />
          </div>

          <div class="col-md-7">
            <label class="form-label">Descripción</label>
            <textarea
              v-if="modoEdicion"
              v-model="formularioCategoria.descripcion"
              class="form-control"
              maxlength="250"
              rows="2"
              placeholder="Describe esta categoría..."
            ></textarea>

            <textarea
              v-else
              v-model="nuevaCategoria.descripcion"
              class="form-control"
              maxlength="250"
              rows="2"
              placeholder="Describe esta categoría..."
            ></textarea>
          </div>

          <div class="col-12 d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              class="btn btn-cancelar"
              @click="cancelarEdicion"
            >
              Cancelar
            </button>

            <button type="submit" class="btn btn-guardar">
              <i class="pi pi-check me-2"></i>
              {{ modoEdicion ? "Guardar cambios" : "Registrar categoría" }}
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
          <h2 class="listado-titulo">Categorías registradas</h2>
          <p class="texto-ayuda mb-0">
            Total: {{ categorias.length }} categorías
          </p>
        </div>

        <div class="buscador-categorias">
          <i class="pi pi-search"></i>
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar categoría..."
          />
        </div>
      </div>

      <!-- CARGANDO -->
      <div v-if="cargando" class="estado-vacio">
        <i class="pi pi-spin pi-spinner"></i>
        <p>Cargando categorías...</p>
      </div>

      <!-- TABLA -->
      <div v-else-if="!error" class="table-responsive">
        <table class="table tabla-categorias align-middle mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Fecha de registro</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="categoria in categoriasFiltradas"
              :key="categoria.id_categoria"
            >
              <td class="id-categoria">#{{ categoria.id_categoria }}</td>

              <td>
                <div class="nombre-categoria">
                  <span class="icono-categoria">
                    <i class="pi pi-tag"></i>
                  </span>
                  <span>{{ categoria.nombre }}</span>
                </div>
              </td>

              <td class="descripcion-categoria">
                {{ categoria.descripcion || "-" }}
              </td>

              <td>
                <span
                  :class="
                    categoria.estado ? 'estado-activo' : 'estado-inactivo'
                  "
                >
                  {{ categoria.estado ? "Activo" : "Inactivo" }}
                </span>
              </td>

              <td class="fecha-categoria">
                {{ formatoFecha(categoria.fecha_registro) }}
              </td>

              <td>
                <div class="acciones-categoria">
                  <button
                    class="btn-accion btn-editar"
                    title="Editar categoría"
                    @click="editarCategoria(categoria.id_categoria)"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>

                  <button
                    v-if="categoria.estado === true"
                    class="btn-accion btn-desactivar"
                    title="Desactivar categoría"
                    @click="desactivarCategoria(categoria.id_categoria)"
                  >
                    <i class="pi pi-ban"></i>
                  </button>

                  <button
                    v-else
                    class="btn-accion btn-activar"
                    title="Activar categoría"
                    @click="activarCategoria(categoria.id_categoria)"
                  >
                    <i class="pi pi-check"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="categoriasFiltradas.length === 0">
              <td colspan="6" class="sin-resultados">
                <i class="pi pi-search"></i>
                <p class="mb-0">No se encontraron categorías.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<style scoped>
.categorias-admin {
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

.buscador-categorias {
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

.buscador-categorias input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #493326;
  font-size: 11px;
}

.tabla-categorias {
  min-width: 750px;
  font-size: 11px;
}

.tabla-categorias thead th {
  padding: 12px 10px;
  background: #f6f0e8;
  color: #634632;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  border-bottom: 1px solid #e9dfd3;
}

.tabla-categorias tbody td {
  padding: 11px 10px;
  color: #66564a;
  border-bottom: 1px solid #f0e9e1;
}

.tabla-categorias tbody tr:hover {
  background: #fdfaf6;
}

.id-categoria {
  color: #a17b4d !important;
  font-weight: 700;
}

.nombre-categoria {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #493326;
  font-weight: 700;
}

.icono-categoria {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background: #f6f0e8;
  color: #98734c;
}

.descripcion-categoria {
  max-width: 250px;
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

.fecha-categoria {
  white-space: nowrap;
}

.acciones-categoria {
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

  .buscador-categorias {
    width: 100%;
  }

  .listado-header {
    align-items: stretch !important;
  }
}
</style>
