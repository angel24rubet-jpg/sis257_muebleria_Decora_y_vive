<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
  listarProductos,
  eliminarProducto as eliminarProductoService,
} from "@/services/productoService";
import { listarCategorias } from "@/services/categoriaService";
import { listarColores } from "@/services/colorService";
import api from "@/services/api";

const productos = ref<any[]>([]);
const categorias = ref<any[]>([]);
const coloresDisponibles = ref<any[]>([]);

const cargando = ref(false);
const error = ref("");
const mensaje = ref("");
const busqueda = ref("");

const mostrarFormulario = ref(false);
const modoEdicion = ref(false);
const idProductoEditar = ref<number | null>(null);

const nuevoProducto = ref({
  nombre: "",
  descripcion: "",
  precio: 0,
  fotografia: "",
  id_categoria: null as number | null,
});

const coloresSeleccionados = ref<{ id_color: number | null; stock: number }[]>([
  { id_color: null, stock: 1 },
]);

const productosFiltrados = computed(() => {
  const termino = busqueda.value.toLowerCase().trim();

  return productos.value.filter((producto) =>
    producto.nombre?.toLowerCase().includes(termino),
  );
});

const cargarProductos = async () => {
  try {
    cargando.value = true;
    error.value = "";
    productos.value = await listarProductos();
  } catch (err) {
    console.error("Error al listar productos:", err);
    error.value = "No se pudieron cargar los productos.";
  } finally {
    cargando.value = false;
  }
};

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

const agregarSegundoColor = () => {
  if (coloresSeleccionados.value.length < 2) {
    coloresSeleccionados.value.push({
      id_color: null,
      stock: 1,
    });
  }
};

const quitarColor = (indice: number) => {
  coloresSeleccionados.value.splice(indice, 1);
};

const limpiarFormulario = () => {
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
};

const abrirNuevoProducto = () => {
  limpiarFormulario();
  mensaje.value = "";
  mostrarFormulario.value = true;
};

const cancelarFormulario = () => {
  limpiarFormulario();
  mostrarFormulario.value = false;
  mensaje.value = "";
};

const validarColores = () => {
  const coloresValidos = coloresSeleccionados.value.every(
    (color) =>
      color.id_color !== null &&
      Number.isInteger(color.stock) &&
      color.stock >= 1,
  );

  return (
    coloresSeleccionados.value.length >= 1 &&
    coloresSeleccionados.value.length <= 2 &&
    coloresValidos
  );
};

const registrarProducto = async () => {
  try {
    mensaje.value = "";

    if (!validarColores()) {
      mensaje.value = "Seleccione entre uno y dos colores con stock válido.";
      return;
    }

    const datosProducto = {
      ...nuevoProducto.value,
      colores: coloresSeleccionados.value.map((color) => ({
        id_color: color.id_color,
        stock: color.stock,
      })),
    };

    await api.post("/productos", datosProducto);

    mensaje.value = "Producto registrado correctamente.";
    limpiarFormulario();
    mostrarFormulario.value = false;

    await cargarProductos();
  } catch (err) {
    console.error("Error al registrar producto:", err);
    mensaje.value = "No se pudo registrar el producto.";
  }
};

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

    coloresSeleccionados.value = producto.colores.map((item: any) => ({
      id_color: item.color?.id_color ?? item.id_color,
      stock: item.stock,
    }));

    if (coloresSeleccionados.value.length === 0) {
      coloresSeleccionados.value = [{ id_color: null, stock: 1 }];
    }

    idProductoEditar.value = id;
    modoEdicion.value = true;
    mostrarFormulario.value = true;
    mensaje.value = "";
  } catch (err) {
    console.error("Error al cargar producto:", err);
    mensaje.value = "No se pudieron cargar los datos del producto.";
  }
};

const modificarProducto = async () => {
  try {
    mensaje.value = "";

    if (idProductoEditar.value === null) return;

    if (!validarColores()) {
      mensaje.value = "Seleccione entre uno y dos colores con stock válido.";
      return;
    }

    const datosProducto = {
      nombre: nuevoProducto.value.nombre,
      descripcion: nuevoProducto.value.descripcion,
      precio: nuevoProducto.value.precio,
      fotografia: nuevoProducto.value.fotografia,
      id_categoria: nuevoProducto.value.id_categoria,
    };

    await api.patch(`/productos/${idProductoEditar.value}`, datosProducto);

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

    mensaje.value = "Producto modificado correctamente.";

    limpiarFormulario();
    mostrarFormulario.value = false;

    await cargarProductos();
  } catch (err) {
    console.error("Error al modificar producto:", err);
    mensaje.value = "No se pudo modificar el producto.";
  }
};

const eliminarProducto = async (id: number) => {
  if (!confirm("¿Está seguro de eliminar este producto?")) return;

  try {
    mensaje.value = "";
    await eliminarProductoService(id);
    mensaje.value = "Producto eliminado correctamente.";
    await cargarProductos();
  } catch (err) {
    console.error(err);
    mensaje.value = "No se pudo eliminar el producto.";
  }
};

const formatoFecha = (fecha: string) => {
  if (!fecha) return "-";

  const fechaValida = new Date(fecha);

  if (isNaN(fechaValida.getTime())) return fecha;

  return fechaValida.toLocaleDateString("es-BO");
};

onMounted(() => {
  cargarProductos();
  cargarCategorias();
  cargarColores();
});
</script>

<template>
  <main class="productos-admin container-fluid py-3 px-3 px-lg-4">
    <!-- ENCABEZADO -->
    <div
      class="encabezado-admin d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"
    >
      <div>
        <span class="subtitulo-admin">GESTIÓN DE INVENTARIO</span>
        <h1 class="titulo-admin">Administración de productos</h1>
        <p class="descripcion-admin mb-0">
          Gestiona los muebles, precios, categorías y existencias de tu tienda.
        </p>
      </div>

      <button class="btn btn-nuevo" @click="abrirNuevoProducto">
        <i class="pi pi-plus me-2"></i>
        Nuevo producto
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
        @click="cargarProductos"
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
          <span class="subtitulo-admin">INFORMACIÓN DEL MUEBLE</span>
          <h2 class="formulario-titulo">
            {{ modoEdicion ? "Modificar producto" : "Registrar producto" }}
          </h2>
        </div>

        <button class="btn-cerrar" type="button" @click="cancelarFormulario">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <form
        @submit.prevent="
          modoEdicion ? modificarProducto() : registrarProducto()
        "
      >
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Nombre del producto</label>
            <input
              v-model="nuevoProducto.nombre"
              type="text"
              class="form-control"
              maxlength="150"
              placeholder="Ej. Sofá de tres cuerpos"
              required
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">Categoría</label>
            <select
              v-model.number="nuevoProducto.id_categoria"
              class="form-select"
              required
            >
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

          <div class="col-md-6">
            <label class="form-label">Precio (Bs)</label>
            <input
              v-model.number="nuevoProducto.precio"
              type="number"
              class="form-control"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              required
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">Fotografía (URL)</label>
            <input
              v-model="nuevoProducto.fotografia"
              type="text"
              class="form-control"
              maxlength="500"
              placeholder="https://..."
            />
          </div>

          <div class="col-12">
            <label class="form-label">Descripción</label>
            <textarea
              v-model="nuevoProducto.descripcion"
              class="form-control"
              maxlength="500"
              rows="2"
              placeholder="Describe las características del producto..."
            ></textarea>
          </div>

          <!-- COLORES Y STOCK -->
          <div class="col-12">
            <div class="separador-formulario"></div>

            <div
              class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2"
            >
              <div>
                <h3 class="seccion-formulario mb-1">Colores y existencias</h3>
                <p class="texto-ayuda mb-0">
                  Puedes asignar hasta dos colores por producto.
                </p>
              </div>

              <button
                v-if="coloresSeleccionados.length < 2"
                type="button"
                class="btn btn-agregar-color"
                @click="agregarSegundoColor"
              >
                <i class="pi pi-plus me-1"></i>
                Agregar color
              </button>
            </div>

            <div class="row g-3">
              <div
                v-for="(color, indice) in coloresSeleccionados"
                :key="indice"
                class="col-md-6"
              >
                <div class="color-panel">
                  <div
                    class="d-flex justify-content-between align-items-center mb-2"
                  >
                    <span class="color-titulo">Color {{ indice + 1 }}</span>

                    <button
                      v-if="coloresSeleccionados.length > 1"
                      type="button"
                      class="btn-quitar-color"
                      @click="quitarColor(indice)"
                    >
                      <i class="pi pi-trash"></i>
                      Quitar
                    </button>
                  </div>

                  <div class="row g-2">
                    <div class="col-7">
                      <label class="form-label">Color</label>
                      <select
                        v-model.number="color.id_color"
                        class="form-select"
                        required
                      >
                        <option :value="null" disabled>Seleccione</option>

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

                    <div class="col-5">
                      <label class="form-label">Stock</label>
                      <input
                        v-model.number="color.stock"
                        type="number"
                        class="form-control"
                        min="1"
                        step="1"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- BOTONES -->
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
              {{ modoEdicion ? "Actualizar producto" : "Guardar producto" }}
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
          <h2 class="listado-titulo">Productos registrados</h2>
          <p class="texto-ayuda mb-0">
            Total: {{ productos.length }} productos
          </p>
        </div>

        <div class="buscador-productos">
          <i class="pi pi-search"></i>
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar producto..."
          />
        </div>
      </div>

      <div v-if="cargando" class="estado-vacio">
        <i class="pi pi-spin pi-spinner"></i>
        <p>Cargando productos...</p>
      </div>

      <div v-else-if="!error" class="table-responsive">
        <table class="table tabla-productos align-middle mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Registro</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="producto in productosFiltrados"
              :key="producto.id_producto"
            >
              <td class="id-producto">#{{ producto.id_producto }}</td>

              <td>
                <div class="producto-info">
                  <img
                    v-if="producto.fotografia"
                    :src="producto.fotografia"
                    :alt="producto.nombre"
                    class="imagen-producto"
                  />
                  <div v-else class="imagen-sin-foto">
                    <i class="pi pi-image"></i>
                  </div>

                  <span class="nombre-producto">{{ producto.nombre }}</span>
                </div>
              </td>

              <td class="descripcion-celda">
                {{ producto.descripcion || "-" }}
              </td>

              <td class="precio-producto">
                Bs {{ Number(producto.precio).toFixed(2) }}
              </td>

              <td>{{ producto.categoria?.nombre || "-" }}</td>

              <td>
                <span
                  :class="producto.estado ? 'estado-activo' : 'estado-inactivo'"
                >
                  {{ producto.estado ? "Activo" : "Eliminado" }}
                </span>
              </td>

              <td class="fecha-producto">
                {{ formatoFecha(producto.fecha_registro) }}
              </td>

              <td>
                <div class="acciones-producto">
                  <button
                    class="btn-accion btn-editar"
                    title="Editar producto"
                    @click="editarProducto(producto.id_producto)"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>

                  <button
                    v-if="producto.estado"
                    class="btn-accion btn-eliminar"
                    title="Eliminar producto"
                    @click="eliminarProducto(producto.id_producto)"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="productosFiltrados.length === 0">
              <td colspan="8" class="sin-resultados">
                <i class="pi pi-search"></i>
                <p class="mb-0">No se encontraron productos.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<style scoped>
.productos-admin {
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

.form-control,
.form-select {
  min-height: 36px;
  border: 1px solid #e4d9cd;
  border-radius: 5px;
  color: #493326;
  font-size: 12px;
  box-shadow: none;
}

.form-control:focus,
.form-select:focus {
  border-color: #a17b4d;
  box-shadow: 0 0 0 2px rgba(161, 123, 77, 0.12);
}

.separador-formulario {
  border-top: 1px solid #eee5db;
  margin: 7px 0 15px;
}

.seccion-formulario {
  color: #493326;
  font-size: 14px;
  font-weight: 700;
}

.btn-agregar-color {
  border: 1px solid #b6976e;
  border-radius: 5px;
  background: #fffaf2;
  color: #806044;
  font-size: 11px;
  padding: 7px 11px;
}

.color-panel {
  padding: 12px;
  border: 1px solid #e9dfd3;
  border-radius: 6px;
  background: #faf7f2;
}

.color-titulo {
  color: #634632;
  font-size: 12px;
  font-weight: 700;
}

.btn-quitar-color {
  border: none;
  background: transparent;
  color: #a14f42;
  font-size: 10px;
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

.buscador-productos {
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

.buscador-productos input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #493326;
  font-size: 11px;
}

.tabla-productos {
  min-width: 950px;
  font-size: 11px;
}

.tabla-productos thead th {
  padding: 12px 10px;
  background: #f6f0e8;
  color: #634632;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  border-bottom: 1px solid #e9dfd3;
}

.tabla-productos tbody td {
  padding: 10px;
  color: #66564a;
  border-bottom: 1px solid #f0e9e1;
}

.tabla-productos tbody tr:hover {
  background: #fdfaf6;
}

.id-producto {
  color: #a17b4d !important;
  font-weight: 700;
}

.producto-info {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 150px;
}

.imagen-producto,
.imagen-sin-foto {
  width: 48px;
  height: 43px;
  flex-shrink: 0;
  border-radius: 5px;
  border: 1px solid #eee5db;
  background: #faf7f2;
}

.imagen-producto {
  object-fit: contain;
}

.imagen-sin-foto {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b9a58f;
  font-size: 17px;
}

.nombre-producto {
  color: #493326;
  font-size: 11px;
  font-weight: 700;
}

.descripcion-celda {
  max-width: 170px;
}

.precio-producto {
  color: #806044 !important;
  font-weight: 700;
  white-space: nowrap;
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

.fecha-producto {
  white-space: nowrap;
}

.acciones-producto {
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

  .buscador-productos {
    width: 100%;
  }

  .listado-header {
    align-items: stretch !important;
  }
}
</style>
