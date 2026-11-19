<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import {
  listarVentas,
  registrarVenta,
  buscarVenta,
  anularVenta,
} from "@/services/ventaService";

import { listarClientes } from "@/services/clienteService";
import { listarPedidos } from "@/services/pedidosService";
import { listarProductos, buscarProducto } from "@/services/productoService";

const ventas = ref<any[]>([]);
const pedidos = ref<any[]>([]);
const apartadoActivo = ref<"presenciales" | "virtuales">("presenciales");
const clientes = ref<any[]>([]);
const productos = ref<any[]>([]);

const cargando = ref(false);
const mensaje = ref("");
const error = ref("");
const busqueda = ref("");

const mostrarFormulario = ref(false);
const mostrarDetalle = ref(false);

const ventaSeleccionada = ref<any>(null);
const pedidoSeleccionado = ref<any>(null);

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

const subtotal = computed(() => {
  return detalles.value.reduce((total, item) => {
    return total + Number(item.precio_unitario) * Number(item.cantidad);
  }, 0);
});

const totalVenta = computed(() => {
  return Math.max(0, subtotal.value - Number(descuento.value || 0));
});

const ventasFiltradas = computed(() => {
  const termino = busqueda.value.toLowerCase().trim();

  return ventas.value.filter((venta) => {
    const cliente = `${venta.cliente?.nombres || ""} ${venta.cliente?.apellidos || ""}`;

    return (
      String(venta.numero_comprobante || "")
        .toLowerCase()
        .includes(termino) ||
      cliente.toLowerCase().includes(termino) ||
      String(venta.id_venta).includes(termino)
    );
  });
});

const pedidosVirtuales = computed(() => {
  const termino = busqueda.value.toLowerCase().trim();

  return pedidos.value.filter((pedido) => {
    const pagoConfirmado =
      pedido.estado_pago === "PAGADO" ||
      pedido.pagos?.some((pago: any) => pago.estado_pago === "PAGADO");

    if (!pagoConfirmado) return false;

    const cliente = pedido.usuario?.nombre_completo || "";
    const productosPedido = (pedido.detalles || [])
      .map((detalle: any) => detalle.productoColor?.producto?.nombre || "")
      .join(" ");

    return (
      String(pedido.numero_pedido || "")
        .toLowerCase()
        .includes(termino) ||
      cliente.toLowerCase().includes(termino) ||
      productosPedido.toLowerCase().includes(termino) ||
      String(pedido.id_pedido || "").includes(termino)
    );
  });
});

const verPedidoVirtual = (pedido: any) => {
  pedidoSeleccionado.value = pedido;
  mostrarDetalle.value = false;
  mostrarFormulario.value = false;
};

const cerrarDetallePedido = () => {
  pedidoSeleccionado.value = null;
};

const pagoDelPedido = (pedido: any) => {
  return (
    (pedido.pagos || []).find((pago: any) => pago.estado_pago === "PAGADO") ||
    null
  );
};

const cargarPedidos = async () => {
  try {
    pedidos.value = await listarPedidos();
  } catch (err) {
    console.error("Error al cargar pedidos virtuales:", err);
    mensaje.value = "No se pudieron cargar las ventas virtuales.";
  }
};

const productosDelPedido = (pedido: any) => {
  return (pedido.detalles || [])
    .map((detalle: any) => {
      const nombre = detalle.productoColor?.producto?.nombre || "Producto";
      const color = detalle.productoColor?.color?.nombre || "Sin color";
      return `${nombre} (${color}) x${detalle.cantidad}`;
    })
    .join(", ");
};

const cargarVentas = async () => {
  try {
    cargando.value = true;
    error.value = "";

    ventas.value = await listarVentas();
  } catch (err) {
    console.error("Error al cargar ventas:", err);
    error.value = "No se pudieron cargar las ventas.";
  } finally {
    cargando.value = false;
  }
};

const cargarClientes = async () => {
  try {
    clientes.value = await listarClientes();
  } catch (err) {
    console.error("Error al cargar clientes:", err);
    mensaje.value = "No se pudieron cargar los clientes.";
  }
};

const cargarProductos = async () => {
  try {
    productos.value = await listarProductos();
  } catch (err) {
    console.error("Error al cargar productos:", err);
    mensaje.value = "No se pudieron cargar los productos.";
  }
};

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

const abrirFormulario = () => {
  limpiarFormulario();
  mensaje.value = "";
  mostrarFormulario.value = true;
  mostrarDetalle.value = false;
};

const cancelarFormulario = () => {
  limpiarFormulario();
  mostrarFormulario.value = false;
};

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
  } catch (err) {
    console.error("Error al cargar producto:", err);
    mensaje.value = "No se pudieron cargar los colores del producto.";
  }
};

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

const quitarProducto = (index: number) => {
  if (detalles.value.length > 1) {
    detalles.value.splice(index, 1);
  }
};

const registrar = async () => {
  try {
    mensaje.value = "";

    if (!idCliente.value) {
      mensaje.value = "Debe seleccionar un cliente.";
      return;
    }

    if (detalles.value.length === 0) {
      mensaje.value = "Debe agregar al menos un producto.";
      return;
    }

    if (
      detalles.value.some(
        (item) =>
          !item.id_producto_color || !item.cantidad || item.cantidad < 1,
      )
    ) {
      mensaje.value = "Complete correctamente los productos y cantidades.";
      return;
    }

    if (detalles.value.some((item) => item.cantidad > item.stock)) {
      mensaje.value = "La cantidad supera el stock disponible.";
      return;
    }

    if (
      Number(descuento.value) < 0 ||
      Number(descuento.value) > subtotal.value
    ) {
      mensaje.value = "El descuento no puede superar el subtotal.";
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

    mensaje.value = "Venta registrada correctamente.";

    limpiarFormulario();
    mostrarFormulario.value = false;

    await Promise.all([cargarVentas(), cargarPedidos(), cargarProductos()]);
  } catch (err: any) {
    console.error("Error al registrar venta:", err);

    mensaje.value =
      err.response?.data?.message || "No se pudo registrar la venta.";
  }
};

const verVenta = async (id: number) => {
  try {
    cargando.value = true;

    ventaSeleccionada.value = await buscarVenta(id);

    mostrarDetalle.value = true;
    mostrarFormulario.value = false;
  } catch (err) {
    console.error("Error al consultar venta:", err);
    mensaje.value = "No se pudo consultar la venta.";
  } finally {
    cargando.value = false;
  }
};

const cerrarDetalle = () => {
  mostrarDetalle.value = false;
  ventaSeleccionada.value = null;
};

const anular = async (id: number) => {
  const confirmar = window.confirm("¿Está seguro de anular esta venta?");

  if (!confirmar) return;

  try {
    mensaje.value = "";

    await anularVenta(id);

    mensaje.value = "Venta anulada correctamente.";

    await cargarVentas();
    await cargarProductos();
  } catch (err: any) {
    console.error("Error al anular venta:", err);

    mensaje.value =
      err.response?.data?.message || "No se pudo anular la venta.";
  }
};

const formatoFecha = (fecha: string) => {
  if (!fecha) return "-";

  const fechaValida = new Date(fecha);

  if (isNaN(fechaValida.getTime())) return fecha;

  return fechaValida.toLocaleDateString("es-BO");
};

const formatoDinero = (valor: any) => {
  return Number(valor || 0).toFixed(2);
};

onMounted(async () => {
  await Promise.all([
    cargarVentas(),
    cargarPedidos(),
    cargarClientes(),
    cargarProductos(),
  ]);
});
</script>

<template>
  <main class="ventas-admin container-fluid py-3 px-3 px-lg-4">
    <!-- ENCABEZADO -->
    <div
      class="encabezado-admin d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"
    >
      <div>
        <span class="subtitulo-admin">GESTIÓN COMERCIAL</span>
        <h1 class="titulo-admin">Administración de ventas</h1>
        <p class="descripcion-admin mb-0">
          Registra, consulta y administra las ventas de tu mueblería.
        </p>
      </div>

      <button
        v-if="apartadoActivo === 'presenciales'"
        class="btn btn-nuevo"
        @click="abrirFormulario"
      >
        <i class="pi pi-plus me-2"></i>
        Registrar venta
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
      <button class="btn btn-sm btn-outline-danger ms-2" @click="cargarVentas">
        Reintentar
      </button>
    </div>

    <!-- FORMULARIO DE VENTA -->
    <section v-if="mostrarFormulario" class="formulario-admin card mb-4">
      <div
        class="formulario-header d-flex justify-content-between align-items-center"
      >
        <div>
          <span class="subtitulo-admin">NUEVA OPERACIÓN</span>
          <h2 class="formulario-titulo">Registrar nueva venta</h2>
        </div>

        <button type="button" class="btn-cerrar" @click="cancelarFormulario">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <!-- CLIENTE -->
      <div class="mb-4">
        <label class="form-label">Seleccionar cliente</label>

        <select v-model="idCliente" class="form-select" required>
          <option :value="null">Seleccione un cliente</option>

          <option
            v-for="cliente in clientes.filter((c) => c.estado)"
            :key="cliente.id_cliente"
            :value="cliente.id_cliente"
          >
            {{ cliente.nombres }} {{ cliente.apellidos }} - CI: {{ cliente.ci }}
          </option>
        </select>
      </div>

      <!-- PRODUCTOS -->
      <div class="separador-formulario"></div>

      <div
        class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3"
      >
        <div>
          <h3 class="seccion-formulario mb-1">Productos de la venta</h3>
          <p class="texto-ayuda mb-0">
            Selecciona los productos, colores y cantidades.
          </p>
        </div>

        <button type="button" class="btn btn-agregar" @click="agregarProducto">
          <i class="pi pi-plus me-1"></i>
          Agregar producto
        </button>
      </div>

      <div
        v-for="(item, index) in detalles"
        :key="index"
        class="producto-venta"
      >
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="producto-numero">PRODUCTO {{ index + 1 }}</span>

          <button
            type="button"
            class="btn-quitar"
            @click="quitarProducto(index)"
            :disabled="detalles.length === 1"
          >
            <i class="pi pi-trash me-1"></i>
            Quitar
          </button>
        </div>

        <div class="row g-3">
          <div class="col-md-4">
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

          <div class="col-md-3">
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

          <div class="col-md-2">
            <label class="form-label">Cantidad</label>

            <input
              v-model.number="item.cantidad"
              type="number"
              min="1"
              :max="item.stock || undefined"
              class="form-control"
            />
          </div>

          <div class="col-md-3">
            <label class="form-label">Precio unitario (Bs.)</label>

            <input
              :value="formatoDinero(item.precio_unitario)"
              class="form-control"
              readonly
            />
          </div>
        </div>

        <div
          class="resumen-producto d-flex flex-wrap justify-content-between gap-2 mt-3"
        >
          <span>
            <i class="pi pi-box me-1"></i>
            Stock disponible: <strong>{{ item.stock }}</strong>
          </span>

          <span>
            Subtotal del producto:
            <strong>
              Bs.
              {{
                formatoDinero(
                  Number(item.precio_unitario) * Number(item.cantidad),
                )
              }}
            </strong>
          </span>
        </div>
      </div>

      <!-- RESUMEN DE VENTA -->
      <div class="row justify-content-end mt-3">
        <div class="col-md-5 col-lg-4">
          <div class="resumen-venta">
            <h3 class="seccion-formulario mb-3">Resumen de venta</h3>

            <label class="form-label">Descuento (Bs.)</label>

            <input
              v-model.number="descuento"
              type="number"
              min="0"
              :max="subtotal"
              step="0.01"
              class="form-control"
            />

            <div class="detalle-total mt-3">
              <div class="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <strong>Bs. {{ subtotal.toFixed(2) }}</strong>
              </div>

              <div class="d-flex justify-content-between mb-2">
                <span>Descuento:</span>
                <strong>Bs. {{ Number(descuento || 0).toFixed(2) }}</strong>
              </div>

              <div class="linea-total"></div>

              <div class="d-flex justify-content-between align-items-center">
                <span class="total-etiqueta">TOTAL</span>
                <strong class="total-valor">
                  Bs. {{ totalVenta.toFixed(2) }}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BOTONES -->
      <div class="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          class="btn btn-cancelar"
          @click="cancelarFormulario"
        >
          Cancelar
        </button>

        <button type="button" class="btn btn-guardar" @click="registrar">
          <i class="pi pi-check me-2"></i>
          Guardar venta
        </button>
      </div>
    </section>

    <!-- DETALLE DE VENTA -->
    <section
      v-if="mostrarDetalle && ventaSeleccionada"
      class="detalle-admin card mb-4"
    >
      <div
        class="detalle-header d-flex justify-content-between align-items-center"
      >
        <div>
          <span class="subtitulo-admin">COMPROBANTE DE VENTA</span>
          <h2 class="formulario-titulo">Detalle de venta</h2>
        </div>

        <button class="btn btn-cancelar" @click="cerrarDetalle">
          <i class="pi pi-times me-1"></i>
          Cerrar
        </button>
      </div>

      <div class="row g-3 mt-2 mb-3">
        <div class="col-md-4">
          <div class="dato-venta">
            <span>Comprobante</span>
            <strong>{{ ventaSeleccionada.numero_comprobante }}</strong>
          </div>
        </div>

        <div class="col-md-4">
          <div class="dato-venta">
            <span>Cliente</span>
            <strong>
              {{ ventaSeleccionada.cliente?.nombres }}
              {{ ventaSeleccionada.cliente?.apellidos }}
            </strong>
          </div>
        </div>

        <div class="col-md-4">
          <div class="dato-venta">
            <span>Fecha</span>
            <strong>{{ formatoFecha(ventaSeleccionada.fecha_venta) }}</strong>
          </div>
        </div>
      </div>

      <h3 class="seccion-formulario mb-3">Productos vendidos</h3>

      <div class="table-responsive">
        <table class="table tabla-ventas align-middle mb-0">
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
                {{ detalle.productoColor?.producto?.nombre || "-" }}
              </td>

              <td>
                {{ detalle.productoColor?.color?.nombre || "-" }}
              </td>

              <td>{{ detalle.cantidad }}</td>

              <td>Bs. {{ formatoDinero(detalle.precio_unitario) }}</td>

              <td class="precio-tabla">
                Bs. {{ formatoDinero(detalle.subtotal) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="resumen-detalle">
        <div class="d-flex justify-content-between">
          <span>Subtotal:</span>
          <strong>Bs. {{ formatoDinero(ventaSeleccionada.subtotal) }}</strong>
        </div>

        <div class="d-flex justify-content-between">
          <span>Descuento:</span>
          <strong>Bs. {{ formatoDinero(ventaSeleccionada.descuento) }}</strong>
        </div>

        <div class="linea-total"></div>

        <div class="d-flex justify-content-between">
          <span class="total-etiqueta">TOTAL</span>
          <strong class="total-valor">
            Bs. {{ formatoDinero(ventaSeleccionada.total) }}
          </strong>
        </div>
      </div>
    </section>

    <!-- DETALLE DE PEDIDO VIRTUAL -->
    <section v-if="pedidoSeleccionado" class="detalle-admin card mb-4">
      <div
        class="detalle-header d-flex justify-content-between align-items-center"
      >
        <div>
          <span class="subtitulo-admin">COMPRA EN TIENDA VIRTUAL</span>
          <h2 class="formulario-titulo">Detalle del pedido</h2>
        </div>
        <button class="btn btn-cancelar" @click="cerrarDetallePedido">
          <i class="pi pi-times me-1"></i>
          Cerrar
        </button>
      </div>

      <div class="row g-3 mt-2 mb-4">
        <div class="col-md-4">
          <div class="dato-venta">
            <span>Número de pedido</span>
            <strong>{{ pedidoSeleccionado.numero_pedido }}</strong>
          </div>
        </div>
        <div class="col-md-4">
          <div class="dato-venta">
            <span>Cliente</span>
            <strong>{{
              pedidoSeleccionado.usuario?.nombre_completo || "Cliente"
            }}</strong>
          </div>
        </div>
        <div class="col-md-4">
          <div class="dato-venta">
            <span>Fecha del pedido</span>
            <strong>{{ formatoFecha(pedidoSeleccionado.fecha_pedido) }}</strong>
          </div>
        </div>
        <div class="col-md-8">
          <div class="dato-venta">
            <span>Dirección de entrega</span>
            <strong>{{
              pedidoSeleccionado.direccion_entrega || "No especificada"
            }}</strong>
          </div>
        </div>
        <div class="col-md-2">
          <div class="dato-venta">
            <span>Estado del pedido</span>
            <strong>{{
              pedidoSeleccionado.estado_pedido || "PENDIENTE"
            }}</strong>
          </div>
        </div>
        <div class="col-md-2">
          <div class="dato-venta">
            <span>Estado del pago</span>
            <strong class="texto-pagado">PAGADO</strong>
          </div>
        </div>
      </div>

      <h3 class="seccion-formulario mb-3">Productos del pedido</h3>
      <div class="table-responsive">
        <table class="table tabla-ventas align-middle mb-0">
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
              v-for="(detalle, index) in pedidoSeleccionado.detalles || []"
              :key="detalle.id_detalle_pedido || index"
            >
              <td>{{ detalle.productoColor?.producto?.nombre || "-" }}</td>
              <td>{{ detalle.productoColor?.color?.nombre || "-" }}</td>
              <td>{{ detalle.cantidad }}</td>
              <td>Bs. {{ formatoDinero(detalle.precio_unitario) }}</td>
              <td class="precio-tabla">
                Bs. {{ formatoDinero(detalle.subtotal) }}
              </td>
            </tr>
            <tr v-if="!pedidoSeleccionado.detalles?.length">
              <td colspan="5" class="sin-resultados">
                Este pedido no tiene productos registrados.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="resumen-detalle">
        <div class="d-flex justify-content-between">
          <span>Subtotal:</span>
          <strong>Bs. {{ formatoDinero(pedidoSeleccionado.subtotal) }}</strong>
        </div>
        <div class="d-flex justify-content-between">
          <span>Descuento:</span>
          <strong>Bs. {{ formatoDinero(pedidoSeleccionado.descuento) }}</strong>
        </div>
        <div class="linea-total"></div>
        <div class="d-flex justify-content-between">
          <span class="total-etiqueta">TOTAL</span>
          <strong class="total-valor"
            >Bs. {{ formatoDinero(pedidoSeleccionado.total) }}</strong
          >
        </div>
      </div>

      <div
        v-if="pagoDelPedido(pedidoSeleccionado)"
        class="datos-pago-virtual mt-4"
      >
        <h3 class="seccion-formulario mb-2">Información del pago</h3>
        <p v-if="pagoDelPedido(pedidoSeleccionado).nombre_pagador" class="mb-1">
          <strong>Pagador:</strong>
          {{ pagoDelPedido(pedidoSeleccionado).nombre_pagador }}
        </p>
        <p v-if="pagoDelPedido(pedidoSeleccionado).observacion" class="mb-0">
          <strong>Observación:</strong>
          {{ pagoDelPedido(pedidoSeleccionado).observacion }}
        </p>
        <p v-if="pagoDelPedido(pedidoSeleccionado).comprobante" class="mb-0">
          <strong>Comprobante:</strong>
          {{ pagoDelPedido(pedidoSeleccionado).comprobante }}
        </p>
      </div>
    </section>

    <!-- LISTADO DE VENTAS -->
    <section class="listado-admin card">
      <div
        class="listado-header d-flex flex-wrap justify-content-between align-items-center gap-3"
      >
        <div class="w-100">
          <h2 class="listado-titulo">Registro de ventas</h2>
          <div class="pestanas-ventas mt-3">
            <button
              type="button"
              class="pestana-venta"
              :class="{ activa: apartadoActivo === 'presenciales' }"
              @click="apartadoActivo = 'presenciales'"
            >
              <i class="pi pi-shop me-2"></i>
              Ventas presenciales
              <span class="contador-pestana">{{ ventas.length }}</span>
            </button>
            <button
              type="button"
              class="pestana-venta"
              :class="{ activa: apartadoActivo === 'virtuales' }"
              @click="apartadoActivo = 'virtuales'"
            >
              <i class="pi pi-globe me-2"></i>
              Ventas virtuales
              <span class="contador-pestana">{{
                pedidosVirtuales.length
              }}</span>
            </button>
          </div>
          <p
            v-if="apartadoActivo === 'presenciales'"
            class="texto-ayuda mb-0 mt-2"
          >
            Total: {{ ventas.length }} ventas registradas en tienda.
          </p>
          <p v-else class="texto-ayuda mb-0 mt-2">
            Pedidos de la tienda virtual con pago confirmado.
          </p>
        </div>

        <div class="buscador-ventas">
          <i class="pi pi-search"></i>
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar comprobante, cliente o ID..."
          />
        </div>
      </div>

      <div v-if="cargando" class="estado-vacio">
        <i class="pi pi-spin pi-spinner"></i>
        <p>Cargando información...</p>
      </div>

      <div
        v-else-if="!error && apartadoActivo === 'presenciales'"
        class="table-responsive"
      >
        <table class="table tabla-ventas align-middle mb-0">
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
              <th class="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="venta in ventasFiltradas" :key="venta.id_venta">
              <td class="id-venta">#{{ venta.id_venta }}</td>

              <td class="comprobante-venta">
                {{ venta.numero_comprobante }}
              </td>

              <td>
                {{ venta.cliente?.nombres }}
                {{ venta.cliente?.apellidos }}
              </td>

              <td class="fecha-venta">
                {{ formatoFecha(venta.fecha_venta) }}
              </td>

              <td>Bs. {{ formatoDinero(venta.subtotal) }}</td>

              <td>Bs. {{ formatoDinero(venta.descuento) }}</td>

              <td class="precio-tabla">Bs. {{ formatoDinero(venta.total) }}</td>

              <td>
                <span
                  :class="
                    venta.estado === 'ANULADA'
                      ? 'estado-anulada'
                      : 'estado-activo'
                  "
                >
                  {{ venta.estado }}
                </span>
              </td>

              <td>
                <div class="acciones-venta">
                  <button
                    class="btn-accion btn-ver"
                    title="Ver detalle"
                    @click="verVenta(venta.id_venta)"
                  >
                    <i class="pi pi-eye"></i>
                  </button>

                  <button
                    v-if="venta.estado !== 'ANULADA'"
                    class="btn-accion btn-anular"
                    title="Anular venta"
                    @click="anular(venta.id_venta)"
                  >
                    <i class="pi pi-ban"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="ventasFiltradas.length === 0">
              <td colspan="9" class="sin-resultados">
                <i class="pi pi-search"></i>
                <p class="mb-0">No se encontraron ventas.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- VENTAS REALIZADAS EN LA TIENDA VIRTUAL -->
      <div
        v-else-if="!error && apartadoActivo === 'virtuales'"
        class="table-responsive"
      >
        <table class="table tabla-ventas tabla-virtuales align-middle mb-0">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Dirección de entrega</th>
              <th>Total</th>
              <th>Estado del pedido</th>
              <th>Pago</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pedido in pedidosVirtuales" :key="pedido.id_pedido">
              <td class="comprobante-venta">{{ pedido.numero_pedido }}</td>
              <td>{{ pedido.usuario?.nombre_completo || "Cliente" }}</td>
              <td class="fecha-venta">
                {{ formatoFecha(pedido.fecha_pedido) }}
              </td>
              <td class="productos-pedido">
                {{ productosDelPedido(pedido) || "Sin productos" }}
              </td>
              <td>{{ pedido.direccion_entrega || "-" }}</td>
              <td class="precio-tabla">
                Bs. {{ formatoDinero(pedido.total) }}
              </td>
              <td>
                <span class="estado-pedido-virtual">
                  {{ pedido.estado_pedido || "PENDIENTE" }}
                </span>
              </td>
              <td><span class="estado-pagado">PAGADO</span></td>
              <td>
                <div class="acciones-venta">
                  <button
                    type="button"
                    class="btn-accion btn-ver"
                    title="Ver detalle del pedido"
                    @click="verPedidoVirtual(pedido)"
                  >
                    <i class="pi pi-eye"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="pedidosVirtuales.length === 0">
              <td colspan="9" class="sin-resultados">
                <i class="pi pi-shopping-bag"></i>
                <p class="mb-0">No hay ventas virtuales con pago confirmado.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<style scoped>
.ventas-admin {
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
.detalle-admin,
.listado-admin {
  border: 1px solid #e9dfd3;
  border-radius: 9px;
  box-shadow: 0 3px 12px rgba(70, 48, 32, 0.05);
  overflow: hidden;
}

.formulario-admin,
.detalle-admin {
  padding: 20px;
  background: #fffdfa;
}

.formulario-header,
.detalle-header {
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
  margin: 18px 0;
}

.seccion-formulario {
  color: #493326;
  font-size: 14px;
  font-weight: 700;
}

.btn-agregar {
  border: 1px solid #b6976e;
  border-radius: 5px;
  background: #fffaf2;
  color: #806044;
  font-size: 11px;
  padding: 8px 12px;
}

.btn-agregar:hover {
  background: #806044;
  color: white;
}

.producto-venta {
  padding: 15px;
  margin-bottom: 12px;
  border: 1px solid #e9dfd3;
  border-radius: 7px;
  background: #faf7f2;
}

.producto-numero {
  color: #a17b4d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
}

.btn-quitar {
  border: none;
  background: transparent;
  color: #a14f42;
  font-size: 11px;
}

.btn-quitar:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.resumen-producto {
  padding-top: 10px;
  border-top: 1px solid #e9dfd3;
  color: #806044;
  font-size: 11px;
}

.resumen-venta {
  padding: 15px;
  border: 1px solid #e9dfd3;
  border-radius: 7px;
  background: #faf7f2;
}

.detalle-total {
  color: #66564a;
  font-size: 12px;
}

.linea-total {
  border-top: 1px solid #dfd1c1;
  margin: 12px 0;
}

.total-etiqueta {
  color: #634632;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1px;
}

.total-valor {
  color: #806044;
  font-size: 18px;
}

.btn-cancelar {
  border: 1px solid #d8cabb;
  border-radius: 5px;
  background: white;
  color: #634632;
  font-size: 11px;
  padding: 9px 15px;
}

.btn-cancelar:hover {
  background: #f6f0e8;
  color: #634632;
}

.detalle-admin {
  padding: 20px;
}

.dato-venta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 100%;
  padding: 12px;
  border: 1px solid #e9dfd3;
  border-radius: 6px;
  background: #faf7f2;
}

.dato-venta span {
  color: #9a8776;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.dato-venta strong {
  color: #493326;
  font-size: 12px;
}

.texto-pagado {
  color: #47744b !important;
}

.datos-pago-virtual {
  padding: 14px;
  border: 1px solid #e9dfd3;
  border-radius: 7px;
  background: #faf7f2;
  color: #66564a;
  font-size: 12px;
}

.resumen-detalle {
  width: 280px;
  max-width: 100%;
  margin: 18px 0 0 auto;
  color: #66564a;
  font-size: 12px;
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

.buscador-ventas {
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

.buscador-ventas input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #493326;
  font-size: 11px;
}

.tabla-ventas {
  min-width: 950px;
  font-size: 11px;
}

.tabla-ventas thead th {
  padding: 12px 10px;
  background: #f6f0e8;
  color: #634632;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  border-bottom: 1px solid #e9dfd3;
}

.tabla-ventas tbody td {
  padding: 10px;
  color: #66564a;
  border-bottom: 1px solid #f0e9e1;
}

.tabla-ventas tbody tr:hover {
  background: #fdfaf6;
}

.id-venta {
  color: #a17b4d !important;
  font-weight: 700;
}

.comprobante-venta {
  color: #634632 !important;
  font-weight: 700;
}

.fecha-venta {
  white-space: nowrap;
}

.precio-tabla {
  color: #806044 !important;
  font-weight: 700;
  white-space: nowrap;
}

.estado-activo,
.estado-anulada {
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

.estado-anulada {
  background: #f7e9e6;
  color: #a14f42;
}

.acciones-venta {
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

.btn-ver {
  border: 1px solid #e5d4bd;
  background: #faf3e8;
  color: #89643e;
}

.btn-anular {
  border: 1px solid #efd5d1;
  background: #fff2f0;
  color: #ad5549;
}

.btn-ver:hover {
  background: #89643e;
  color: white;
}

.btn-anular:hover {
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

.pestanas-ventas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  border-bottom: 1px solid #eee5db;
}

.pestana-venta {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 10px 13px;
  margin-bottom: -1px;
  border: 1px solid transparent;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: #8b7b70;
  font-size: 11px;
  font-weight: 600;
}

.pestana-venta:hover,
.pestana-venta.activa {
  color: #634632;
}

.pestana-venta.activa {
  border-bottom-color: #a17b4d;
}

.contador-pestana {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 12px;
  background: #f2eade;
  color: #806044;
  font-size: 10px;
}

.tabla-virtuales {
  min-width: 1150px;
}

.productos-pedido {
  min-width: 220px;
  max-width: 330px;
  white-space: normal !important;
  line-height: 1.5;
}

.estado-pedido-virtual,
.estado-pagado {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 20px;
  background: #f2eade;
  color: #806044;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.estado-pagado {
  background: #eaf3e9;
  color: #47744b;
}

@media (max-width: 768px) {
  .titulo-admin {
    font-size: 23px;
  }

  .formulario-admin,
  .detalle-admin {
    padding: 14px;
  }

  .buscador-ventas {
    width: 100%;
  }

  .listado-header {
    align-items: stretch !important;
  }

  .producto-venta {
    padding: 11px;
  }
}
</style>
