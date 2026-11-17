<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import {
  listarVentas,
  registrarVenta,
  buscarVenta,
  anularVenta,
} from "@/services/ventaService";

import { listarClientes } from "@/services/clienteService";

import { listarProductos, buscarProducto } from "@/services/productoService";

// Variables principales
const ventas = ref<any[]>([]);
const clientes = ref<any[]>([]);
const productos = ref<any[]>([]);

const cargando = ref(false);
const mensaje = ref("");
const mostrarFormulario = ref(false);
const mostrarDetalle = ref(false);

const ventaSeleccionada = ref<any>(null);

// Datos del formulario
const idCliente = ref<number | null>(null);
const descuento = ref(0);

const detalles = ref<any[]>([
  {
    id_producto: null,
    id_producto_color: null,
    cantidad: 1,
    precio_unitario: 0,
    stock: 0,
    coloresDisponibles: [],
  },
]);

// Calcular subtotal
const subtotal = computed(() => {
  return detalles.value.reduce((total, item) => {
    return total + Number(item.precio_unitario) * Number(item.cantidad);
  }, 0);
});

// Calcular total
const totalVenta = computed(() => {
  return Math.max(0, subtotal.value - Number(descuento.value || 0));
});

// Cargar ventas
const cargarVentas = async () => {
  try {
    cargando.value = true;
    ventas.value = await listarVentas();
  } catch (error) {
    console.error("Error al cargar ventas:", error);
    mensaje.value = "No se pudieron cargar las ventas";
  } finally {
    cargando.value = false;
  }
};

// Cargar clientes
const cargarClientes = async () => {
  try {
    clientes.value = await listarClientes();
  } catch (error) {
    console.error("Error al cargar clientes:", error);
    mensaje.value = "No se pudieron cargar los clientes";
  }
};

// Cargar productos
const cargarProductos = async () => {
  try {
    productos.value = await listarProductos();
  } catch (error) {
    console.error("Error al cargar productos:", error);
    mensaje.value = "No se pudieron cargar los productos";
  }
};

// Limpiar formulario
const limpiarFormulario = () => {
  idCliente.value = null;
  descuento.value = 0;

  detalles.value = [
    {
      id_producto: null,
      id_producto_color: null,
      cantidad: 1,
      precio_unitario: 0,
      stock: 0,
      coloresDisponibles: [],
    },
  ];
};

// Abrir formulario
const abrirFormulario = () => {
  limpiarFormulario();
  mensaje.value = "";
  mostrarFormulario.value = true;
  mostrarDetalle.value = false;
};

// Cancelar formulario
const cancelarFormulario = () => {
  limpiarFormulario();
  mostrarFormulario.value = false;
};

// Seleccionar producto
const seleccionarProducto = async (index: number) => {
  const item = detalles.value[index];

  item.id_producto_color = null;
  item.precio_unitario = 0;
  item.stock = 0;
  item.coloresDisponibles = [];

  if (!item.id_producto) return;

  try {
    const producto = await buscarProducto(Number(item.id_producto));

    item.coloresDisponibles = producto.colores || [];
    item.precio_unitario = Number(producto.precio || 0);
  } catch (error) {
    console.error("Error al cargar producto:", error);
    mensaje.value = "No se pudieron cargar los colores del producto";
  }
};

// Seleccionar color
const seleccionarColor = (index: number) => {
  const item = detalles.value[index];

  const seleccionado = item.coloresDisponibles.find(
    (pc: any) =>
      Number(pc.id_producto_color) === Number(item.id_producto_color),
  );

  if (seleccionado) {
    item.stock = Number(seleccionado.stock);
  } else {
    item.stock = 0;
  }
};

// Agregar producto
const agregarProducto = () => {
  detalles.value.push({
    id_producto: null,
    id_producto_color: null,
    cantidad: 1,
    precio_unitario: 0,
    stock: 0,
    coloresDisponibles: [],
  });
};

// Quitar producto
const quitarProducto = (index: number) => {
  if (detalles.value.length > 1) {
    detalles.value.splice(index, 1);
  }
};

// Registrar venta
const registrar = async () => {
  try {
    mensaje.value = "";

    if (!idCliente.value) {
      mensaje.value = "Debe seleccionar un cliente";
      return;
    }

    if (detalles.value.length === 0) {
      mensaje.value = "Debe agregar al menos un producto";
      return;
    }

    if (
      detalles.value.some(
        (item) =>
          !item.id_producto_color || !item.cantidad || item.cantidad < 1,
      )
    ) {
      mensaje.value = "Complete correctamente los productos y cantidades";
      return;
    }

    if (detalles.value.some((item) => item.cantidad > item.stock)) {
      mensaje.value = "La cantidad supera el stock disponible";
      return;
    }

    if (
      Number(descuento.value) < 0 ||
      Number(descuento.value) > subtotal.value
    ) {
      mensaje.value = "El descuento no puede superar el subtotal";
      return;
    }

    const venta = {
      id_cliente: Number(idCliente.value),
      descuento: Number(descuento.value),
      detalles: detalles.value.map((item) => ({
        id_producto_color: Number(item.id_producto_color),
        cantidad: Number(item.cantidad),
      })),
    };

    await registrarVenta(venta);

    mensaje.value = "Venta registrada correctamente";

    limpiarFormulario();
    mostrarFormulario.value = false;

    await Promise.all([cargarVentas(), cargarProductos()]);
  } catch (error: any) {
    console.error("Error al registrar venta:", error);

    mensaje.value =
      error.response?.data?.message || "No se pudo registrar la venta";
  }
};

// Consultar venta
const verVenta = async (id: number) => {
  try {
    cargando.value = true;

    ventaSeleccionada.value = await buscarVenta(id);

    mostrarDetalle.value = true;
    mostrarFormulario.value = false;
  } catch (error) {
    console.error("Error al consultar venta:", error);
    mensaje.value = "No se pudo consultar la venta";
  } finally {
    cargando.value = false;
  }
};

// Cerrar detalle
const cerrarDetalle = () => {
  mostrarDetalle.value = false;
  ventaSeleccionada.value = null;
};

// Anular venta
const anular = async (id: number) => {
  const confirmar = confirm("¿Está seguro de anular esta venta?");

  if (!confirmar) return;

  try {
    mensaje.value = "";

    await anularVenta(id);

    mensaje.value = "Venta anulada correctamente";

    await cargarVentas();
    await cargarProductos();
  } catch (error: any) {
    console.error("Error al anular venta:", error);

    mensaje.value =
      error.response?.data?.message || "No se pudo anular la venta";
  }
};

// Inicializar
onMounted(async () => {
  await Promise.all([cargarVentas(), cargarClientes(), cargarProductos()]);
});
</script>

<template>
  <div class="container-fluid p-4">
    <!-- Encabezado -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2>Gestión de Ventas</h2>
        <p>Administra las ventas de Mueblería Decora y Vive.</p>
      </div>

      <button class="btn btn-primary" @click="abrirFormulario">
        Registrar venta
      </button>
    </div>

    <!-- Mensajes -->
    <div v-if="mensaje" class="alert alert-info mt-3">
      {{ mensaje }}
    </div>

    <!-- Formulario de venta -->
    <div v-if="mostrarFormulario" class="card shadow-sm p-4 mb-4">
      <h4 class="mb-4">Registrar nueva venta</h4>

      <!-- Seleccionar cliente -->
      <div class="mb-4">
        <label class="form-label">Cliente</label>

        <select v-model="idCliente" class="form-select" required>
          <option :value="null">Seleccione un cliente</option>

          <option
            v-for="cliente in clientes.filter((c) => c.estado)"
            :key="cliente.id_cliente"
            :value="cliente.id_cliente"
          >
            {{ cliente.nombres }}
            {{ cliente.apellidos }}
            - CI: {{ cliente.ci }}
          </option>
        </select>
      </div>

      <!-- Productos -->
      <h5 class="mb-3">Productos de la venta</h5>

      <div
        v-for="(item, index) in detalles"
        :key="index"
        class="border rounded p-3 mb-3"
      >
        <div class="row">
          <!-- Producto -->
          <div class="col-md-4 mb-3">
            <label class="form-label">Producto</label>

            <select
              v-model="item.id_producto"
              class="form-select"
              @change="seleccionarProducto(index)"
            >
              <option :value="null">Seleccione producto</option>

              <option
                v-for="producto in productos.filter((p) => p.estado)"
                :key="producto.id_producto"
                :value="producto.id_producto"
              >
                {{ producto.nombre }}
              </option>
            </select>
          </div>

          <!-- Color -->
          <div class="col-md-3 mb-3">
            <label class="form-label">Color</label>

            <select
              v-model="item.id_producto_color"
              class="form-select"
              :disabled="!item.coloresDisponibles.length"
              @change="seleccionarColor(index)"
            >
              <option :value="null">Seleccione color</option>

              <option
                v-for="color in item.coloresDisponibles"
                :key="color.id_producto_color"
                :value="color.id_producto_color"
              >
                {{ color.color?.nombre || "Color" }}
                (Stock: {{ color.stock }})
              </option>
            </select>
          </div>

          <!-- Cantidad -->
          <div class="col-md-2 mb-3">
            <label class="form-label">Cantidad</label>

            <input
              v-model.number="item.cantidad"
              type="number"
              min="1"
              :max="item.stock"
              class="form-control"
            />
          </div>

          <!-- Precio -->
          <div class="col-md-2 mb-3">
            <label class="form-label">Precio unitario</label>

            <input
              :value="Number(item.precio_unitario).toFixed(2)"
              class="form-control"
              readonly
            />
          </div>

          <!-- Eliminar fila -->
          <div class="col-md-1 d-flex align-items-end mb-3">
            <button
              type="button"
              class="btn btn-danger"
              @click="quitarProducto(index)"
              :disabled="detalles.length === 1"
            >
              X
            </button>
          </div>
        </div>

        <div class="text-end">
          <strong> Stock disponible: {{ item.stock }} </strong>

          <span class="ms-3">
            Subtotal: Bs.
            {{
              (Number(item.precio_unitario) * Number(item.cantidad)).toFixed(2)
            }}
          </span>
        </div>
      </div>

      <!-- Agregar producto -->
      <button
        type="button"
        class="btn btn-outline-primary mb-4"
        @click="agregarProducto"
      >
        + Agregar producto
      </button>

      <!-- Resumen -->
      <div class="row justify-content-end">
        <div class="col-md-4">
          <label class="form-label"> Descuento (Bs.) </label>

          <input
            v-model.number="descuento"
            type="number"
            min="0"
            :max="subtotal"
            class="form-control"
          />

          <div class="border rounded p-3 mt-3">
            <div class="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <strong>Bs. {{ subtotal.toFixed(2) }}</strong>
            </div>

            <div class="d-flex justify-content-between mb-2">
              <span>Descuento:</span>
              <strong> Bs. {{ Number(descuento || 0).toFixed(2) }} </strong>
            </div>

            <hr />

            <div class="d-flex justify-content-between">
              <h5>Total:</h5>
              <h5>Bs. {{ totalVenta.toFixed(2) }}</h5>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones -->
      <div class="mt-4">
        <button class="btn btn-success" @click="registrar">
          Guardar venta
        </button>

        <button class="btn btn-secondary ms-2" @click="cancelarFormulario">
          Cancelar
        </button>
      </div>
    </div>

    <!-- Detalle de venta -->
    <div
      v-if="mostrarDetalle && ventaSeleccionada"
      class="card shadow-sm p-4 mb-4"
    >
      <div class="d-flex justify-content-between align-items-center">
        <h4>Detalle de venta</h4>

        <button class="btn btn-secondary btn-sm" @click="cerrarDetalle">
          Cerrar
        </button>
      </div>

      <hr />

      <p>
        <strong>Comprobante:</strong>
        {{ ventaSeleccionada.numero_comprobante }}
      </p>

      <p>
        <strong>Cliente:</strong>
        {{ ventaSeleccionada.cliente?.nombres }}
        {{ ventaSeleccionada.cliente?.apellidos }}
      </p>

      <p>
        <strong>Fecha:</strong>
        {{ ventaSeleccionada.fecha_venta }}
      </p>

      <h5 class="mt-3">Productos</h5>

      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Color</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="detalle in ventaSeleccionada.detalles"
              :key="detalle.id_detalle_venta"
            >
              <td>
                {{ detalle.productoColor?.producto?.nombre }}
              </td>

              <td>
                {{ detalle.productoColor?.color?.nombre }}
              </td>

              <td>{{ detalle.cantidad }}</td>

              <td>Bs. {{ detalle.precio_unitario }}</td>

              <td>Bs. {{ detalle.subtotal }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="text-end">
        <p>Subtotal: Bs. {{ ventaSeleccionada.subtotal }}</p>
        <p>Descuento: Bs. {{ ventaSeleccionada.descuento }}</p>
        <h4>Total: Bs. {{ ventaSeleccionada.total }}</h4>
      </div>
    </div>

    <!-- Listado de ventas -->
    <div class="table-responsive">
      <table class="table table-bordered table-striped mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Comprobante</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Subtotal</th>
            <th>Descuento</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="venta in ventas" :key="venta.id_venta">
            <td>{{ venta.id_venta }}</td>

            <td>{{ venta.numero_comprobante }}</td>

            <td>
              {{ venta.cliente?.nombres }}
              {{ venta.cliente?.apellidos }}
            </td>

            <td>{{ venta.fecha_venta }}</td>

            <td>Bs. {{ venta.subtotal }}</td>

            <td>Bs. {{ venta.descuento }}</td>

            <td>
              <strong>Bs. {{ venta.total }}</strong>
            </td>

            <td>{{ venta.estado }}</td>

            <td>
              <button
                class="btn btn-info btn-sm me-1"
                @click="verVenta(venta.id_venta)"
              >
                Ver
              </button>

              <button
                v-if="venta.estado !== 'ANULADA'"
                class="btn btn-danger btn-sm"
                @click="anular(venta.id_venta)"
              >
                Anular
              </button>
            </td>
          </tr>

          <tr v-if="!cargando && ventas.length === 0">
            <td colspan="9" class="text-center">No hay ventas registradas.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="cargando" class="text-center mt-3">Cargando información...</div>
  </div>
</template>
