<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { listarProductos } from "@/services/productoService";
import { listarCategorias } from "@/services/categoriaService";
import api from "@/services/api";
import { listarColores } from "@/services/colorService";

// Lista de productos
const productos = ref<any[]>([]);
const cargando = ref(false);
const error = ref("");
const categorias = ref<any[]>([]);
const mostrarFormulario = ref(false);
const nuevoProducto = ref({
  nombre: "",
  descripcion: "",
  precio: 0,
  fotografia: "",
  id_categoria: null as number | null,
});
const mensaje = ref("");
const modoEdicion = ref(false);
const idProductoEditar = ref<number | null>(null);
const busqueda = ref("");
const coloresDisponibles = ref<any[]>([]);

const productosFiltrados = computed(() => {
  return productos.value.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase().trim()),
  );
});

const coloresSeleccionados = ref<{ id_color: number | null; stock: number }[]>([
  { id_color: null, stock: 1 },
]);

const agregarSegundoColor = () => {
  if (coloresSeleccionados.value.length < 2) {
    coloresSeleccionados.value.push({ id_color: null, stock: 1 });
  }
};

const quitarColor = (indice: number) => {
  coloresSeleccionados.value.splice(indice, 1);
};

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

const cargarCategorias = async () => {
  try {
    const respuesta = await listarCategorias();
    categorias.value = respuesta.filter((categoria: any) => categoria.estado === true);
  } catch (err) {
    console.error("Error al cargar categorías:", err);
  }
};

const cargarColores = async () => {
  try {
    const respuesta = await listarColores();
    coloresDisponibles.value = respuesta.filter((color: any) => color.estado === true);
  } catch (err) {
    console.error("Error al cargar colores:", err);
  }
};

const registrarProducto = async () => {
  try {
    mensaje.value = "";
    if (coloresSeleccionados.value.length < 1) {
      mensaje.value = "Debe seleccionar al menos un color";
      return;
    }
    const coloresValidos = coloresSeleccionados.value.every(
      (color) => color.id_color !== null && Number.isInteger(color.stock) && color.stock >= 1,
    );
    if (!coloresValidos) {
      mensaje.value = "Seleccione los colores y registre un stock válido";
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
    mensaje.value = "Producto registrado correctamente";
    nuevoProducto.value = { nombre: "", descripcion: "", precio: 0, fotografia: "", id_categoria: null };
    coloresSeleccionados.value = [{ id_color: null, stock: 1 }];
    mostrarFormulario.value = false;
    await cargarProductos();
  } catch (err) {
    console.error("Error al registrar producto:", err);
    mensaje.value = "No se pudo registrar el producto";
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
    idProductoEditar.value = id;
    modoEdicion.value = true;
    mostrarFormulario.value = true;
    mensaje.value = "";
  } catch (err) {
    console.error("Error al cargar producto:", err);
    mensaje.value = "No se pudieron cargar los datos del producto";
  }
};

const modificarProducto = async () => {
  try {
    mensaje.value = "";
    if (idProductoEditar.value === null) return;
    const coloresValidos = coloresSeleccionados.value.every(
      (color) => color.id_color !== null && Number.isInteger(color.stock) && color.stock >= 1,
    );
    if (coloresSeleccionados.value.length < 1 || coloresSeleccionados.value.length > 2 || !coloresValidos) {
      mensaje.value = "Seleccione entre uno y dos colores con stock válido";
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
      colores: coloresSeleccionados.value.map((color) => ({ id_color: color.id_color, stock: color.stock })),
    };
    await api.patch(`/productos/${idProductoEditar.value}/colores`, datosColores);
    mensaje.value = "Producto modificado correctamente";
    nuevoProducto.value = { nombre: "", descripcion: "", precio: 0, fotografia: "", id_categoria: null };
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

onMounted(() => {
  cargarProductos();
  cargarCategorias();
  cargarColores();
});
</script>

<template>
  <div>
    <!-- Hero Section de la Plantilla -->
    <section class="py-lg-8 py-5 text-center">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6">
            <h1 class="display-5 mb-3">Product List</h1>
            <p class="text-muted lead">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat ad sint quae sunt, molestiae consectetur vitae! Impedit nulla ea provident quis est eos dolores enim.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Page Content de la Plantilla -->
    <section class="py-lg-8 py-5">
      <div class="container">
        <div class="row">
          
          <!-- Sidebar Filters Estáticos -->
          <aside class="col-lg-3 mb-4">
            <h3 class="fw-semibold mb-3 h5">Filters</h3>
            <div class="mb-4 bg-light border bg-opacity-50 p-4">
              <h6 class="fw-semibold mb-3 text-xs text-uppercase">Category</h6>
              <ul class="list-unstyled lh-lg small mb-0">
                <li><a href="#" class="text-dark">Living Room</a></li>
                <li><a href="#" class="text-dark">Bedroom</a></li>
                <li><a href="#" class="text-dark">Office</a></li>
                <li><a href="#" class="text-dark">Decor</a></li>
              </ul>
            </div>
            <div class="mb-4 bg-light border bg-opacity-50 p-4">
              <h6 class="fw-semibold mb-3 text-xs text-uppercase">Price</h6>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="price1" />
                <label class="form-check-label" for="price1">Under $100</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="price2" />
                <label class="form-check-label" for="price2">$100-$300</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="price3" />
                <label class="form-check-label" for="price3">Above $300</label>
              </div>
            </div>
            <div class="mb-4 bg-light border bg-opacity-50 p-4">
              <h6 class="fw-semibold mb-3 text-xs text-uppercase">Colour</h6>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="col1" />
                <label class="form-check-label" for="col1">Gray</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="col2" />
                <label class="form-check-label" for="col2">Black</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="col3" />
                <label class="form-check-label" for="col3">Wood</label>
              </div>
            </div>
            <div class="d-grid">
              <button class="btn btn-primary">Apply Filters</button>
            </div>
          </aside>

          <!-- Product Grid Estático -->
          <div class="col-lg-9">
            <div class="row g-4">
              <div class="col-12">
                <div class="d-flex flex-column flex-lg-row flex-row justify-content-between gap-4">
                  <div class="col-sm-4 col-lg-3 offset-lg-9">
                    <select class="form-select">
                      <option value="" selected>Sort by: Featured</option>
                      <option value="Best selling">Best selling</option>
                      <option value="Alphabetically, A-Z">Alphabetically, A-Z</option>
                      <option value="Alphabetically, Z-A">Alphabetically, Z-A</option>
                      <option value="Price, low to high">Price, low to high</option>
                      <option value="Price, high to low">Price, high to low</option>
                      <option value="Date, old to new">Date, old to new</option>
                      <option value="Date, new to old">Date, new to old</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Tarjeta 1 -->
              <div class="col-sm-6 col-md-4">
                <div class="card product-card">
                  <a href="#"><img src="/images/product-img-1.jpg" class="card-img-top" alt="Product Name" /></a>
                  <div class="card-body">
                    <p class="text-muted mb-2 text-uppercase text-xs mb-3">Brand</p>
                    <div class="mb-3">
                      <h3 class="h5 mb-1"><a href="#">Modern Sofa</a></h3>
                      <div>
                        <span class="fw-semibold text-decoration-line-through">$59.00</span>
                        <span>$29.00</span>
                      </div>
                    </div>
                    <a href="#" class="btn btn-dark btn-sm">Add to Cart</a>
                  </div>
                </div>
              </div>

              <!-- Tarjeta 2 -->
              <div class="col-sm-6 col-md-4">
                <div class="card product-card">
                  <a href="#"><img src="/images/product-img-2.jpg" class="card-img-top" alt="Product Name" /></a>
                  <div class="card-body">
                    <p class="text-muted mb-2 text-uppercase text-xs mb-3">Brand</p>
                    <div class="mb-3">
                      <h3 class="h5 mb-1"><a href="#">Floor Lamp</a></h3>
                      <div>
                        <span class="fw-semibold text-decoration-line-through">$95.00</span>
                        <span>$89.00</span>
                      </div>
                    </div>
                    <a href="#" class="btn btn-dark btn-sm">Add to Cart</a>
                  </div>
                </div>
              </div>

              <!-- Tarjeta 3 -->
              <div class="col-sm-6 col-md-4">
                <div class="card product-card">
                  <a href="#"><img src="/images/product-img-5.jpg" class="card-img-top" alt="Product Name" /></a>
                  <div class="card-body">
                    <p class="text-muted mb-2 text-uppercase text-xs mb-3">Brand</p>
                    <div class="mb-3">
                      <h3 class="h5 mb-1"><a href="#">High Back Boss Chair</a></h3>
                      <div>
                        <span class="fw-semibold text-decoration-line-through">$78.00</span>
                        <span>$68.00</span>
                      </div>
                    </div>
                    <a href="#" class="btn btn-dark btn-sm">Add to Cart</a>
                  </div>
                </div>
              </div>

              <!-- Tarjeta 4 -->
              <div class="col-sm-6 col-md-4">
                <div class="card product-card">
                  <a href="#"><img src="/images/product-img-6.jpg" class="card-img-top" alt="Product Name" /></a>
                  <div class="card-body">
                    <p class="text-muted mb-2 text-uppercase text-xs mb-3">Brand</p>
                    <div class="mb-3">
                      <h3 class="h5 mb-1"><a href="#">Fancy Metal Clock</a></h3>
                      <div>
                        <span class="fw-semibold text-decoration-line-through">$78.00</span>
                        <span>$68.00</span>
                      </div>
                    </div>
                    <a href="#" class="btn btn-dark btn-sm">Add to Cart</a>
                  </div>
                </div>
              </div>

              <!-- Tarjeta 5 -->
              <div class="col-sm-6 col-md-4">
                <div class="card product-card">
                  <a href="#"><img src="/images/product-img-3.jpg" class="card-img-top" alt="Product Name" /></a>
                  <div class="card-body">
                    <p class="text-muted mb-2 text-uppercase text-xs mb-3">Brand</p>
                    <div class="mb-3">
                      <h3 class="h5 mb-1"><a href="#">Comfort Chair</a></h3>
                      <div>
                        <span class="fw-semibold text-decoration-line-through">$38.00</span>
                        <span>$28.00</span>
                      </div>
                    </div>
                    <a href="#" class="btn btn-dark btn-sm">Add to Cart</a>
                  </div>
                </div>
              </div>

              <!-- Tarjeta 6 -->
              <div class="col-sm-6 col-md-4">
                <div class="card product-card">
                  <a href="#"><img src="/images/product-img-7.jpg" class="card-img-top" alt="Product Name" /></a>
                  <div class="card-body">
                    <p class="text-muted mb-2 text-uppercase text-xs mb-3">Brand</p>
                    <div class="mb-3">
                      <h3 class="h5 mb-1"><a href="#">Morden Metal Frame Stool</a></h3>
                      <div>
                        <span class="fw-semibold">$28.00</span>
                        <span>$18.00</span>
                      </div>
                    </div>
                    <a href="#" class="btn btn-dark btn-sm">Add to Cart</a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination Estática -->
            <nav class="mt-4">
              <ul class="pagination justify-content-center">
                <li class="page-item disabled"><a class="page-link" href="#">«</a></li>
                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item"><a class="page-link" href="#">»</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================================================= -->
    <!-- ZONA DE ADMINISTRACIÓN (BACKOFFICE DEL COMPAÑERO)       -->
    <!-- ======================================================= -->
    <hr class="my-5 opacity-25">
    
    <section class="container mb-5 bg-white p-5 rounded shadow-sm border">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h4 mb-1"><i class="bi bi-gear-fill me-2 text-primary"></i>Panel Administrativo</h2>
          <p class="text-muted small mb-0">Gestión interna de inventario y base de datos.</p>
        </div>
        <button class="btn btn-dark" @click="mostrarFormulario = !mostrarFormulario">
          <i class="bi" :class="mostrarFormulario ? 'bi-x-lg' : 'bi-plus-lg'"></i> 
          {{ mostrarFormulario ? 'Cerrar Panel' : 'Nuevo Producto' }}
        </button>
      </div>

      <!-- Formulario de registro (Código original) -->
      <div v-if="mostrarFormulario" class="bg-light p-4 rounded mb-5 border">
        <h3 class="h5 mb-4 border-bottom pb-2">{{ modoEdicion ? "Modificar producto" : "Registrar producto" }}</h3>
        <form @submit.prevent="modoEdicion ? modificarProducto() : registrarProducto()">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Nombre:</label>
              <input v-model="nuevoProducto.nombre" type="text" class="form-control" maxlength="150" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Precio:</label>
              <input v-model.number="nuevoProducto.precio" type="number" class="form-control" min="0.01" step="0.01" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Categoría:</label>
              <select v-model.number="nuevoProducto.id_categoria" class="form-select" required>
                <option :value="null" disabled>Seleccione una categoría</option>
                <option v-for="categoria in categorias" :key="categoria.id_categoria" :value="categoria.id_categoria">{{ categoria.nombre }}</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Fotografía (URL):</label>
              <input v-model="nuevoProducto.fotografia" type="text" class="form-control" maxlength="500" />
            </div>
            <div class="col-12">
              <label class="form-label">Descripción:</label>
              <textarea v-model="nuevoProducto.descripcion" class="form-control" rows="3" maxlength="500"></textarea>
            </div>
          </div>

          <h4 class="h6 mt-4 mb-3 border-bottom pb-2">Gestión de Stock y Colores</h4>
          <div class="row g-3 mb-3" v-for="(color, indice) in coloresSeleccionados" :key="indice">
            <div class="col-md-5">
              <label class="form-label small text-muted">Color {{ indice + 1 }}</label>
              <select v-model.number="color.id_color" class="form-select form-select-sm" required>
                <option :value="null" disabled>Seleccione</option>
                <option v-for="disponible in coloresDisponibles" :key="disponible.id_color" :value="disponible.id_color" :disabled="coloresSeleccionados.some((seleccionado, i) => i !== indice && seleccionado.id_color === disponible.id_color)">
                  {{ disponible.nombre }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label small text-muted">Stock</label>
              <input v-model.number="color.stock" type="number" class="form-control form-control-sm" min="1" step="1" required />
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <button v-if="coloresSeleccionados.length > 1" type="button" class="btn btn-outline-danger btn-sm w-100" @click="quitarColor(indice)">Quitar</button>
            </div>
          </div>

          <div class="d-flex gap-2 mt-4">
            <button v-if="coloresSeleccionados.length < 2" type="button" class="btn btn-secondary btn-sm" @click="agregarSegundoColor">
              <i class="bi bi-plus"></i> Añadir Variante
            </button>
            <div class="ms-auto">
              <button type="button" class="btn btn-light me-2" @click="mostrarFormulario = false">Cancelar</button>
              <button type="submit" class="btn btn-primary">{{ modoEdicion ? "Actualizar" : "Guardar" }}</button>
            </div>
          </div>
        </form>
      </div>

      <!-- Mensajes y Alertas -->
      <div v-if="mensaje" class="alert alert-info">{{ mensaje }}</div>
      <div v-if="error" class="alert alert-danger">{{ error }} <button class="btn btn-sm btn-outline-danger ms-3" @click="cargarProductos">Reintentar</button></div>

      <!-- Tabla cruda de la base de datos -->
      <div class="table-responsive mt-4" v-if="!error">
        <table class="tabla table table-hover table-bordered align-middle text-sm">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="producto in productosFiltrados" :key="producto.id_producto">
              <td>{{ producto.id_producto }}</td>
              <td class="fw-semibold">{{ producto.nombre }}</td>
              <td class="text-truncate" style="max-width: 150px;" :title="producto.descripcion">{{ producto.descripcion || "-" }}</td>
              <td>${{ producto.precio }}</td>
              <td><span class="badge bg-secondary">{{ producto.categoria?.nombre || "-" }}</span></td>
              <td>
                <span class="badge" :class="producto.estado ? 'bg-success' : 'bg-danger'">{{ producto.estado ? "Activo" : "Eliminado" }}</span>
              </td>
              <td class="text-muted small">{{ new Date(producto.fecha_registro).toLocaleDateString() }}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary" @click="editarProducto(producto.id_producto)">Editar</button>
              </td>
            </tr>
            <tr v-if="productosFiltrados.length === 0">
              <td colspan="8" class="text-center py-4 text-muted">No se encontraron productos en la base de datos.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tabla {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
.tabla th, .tabla td {
  padding: 12px;
}
</style>