<script setup lang="ts">
import { ref, onMounted } from "vue";
import { listarPedidos } from "@/services/pedidosService";

const pedidos = ref<any[]>([]);
const cargando = ref(true);
const error = ref("");

const telefono = "+59177126603";
const telefonoVisible = "+591 77126603";

async function cargarPedidos() {
  cargando.value = true;
  error.value = "";

  try {
    pedidos.value = await listarPedidos();
  } catch (e: any) {
    error.value =
      e.response?.data?.message || "No se pudieron cargar tus pedidos.";
  } finally {
    cargando.value = false;
  }
}

function formatoFecha(fecha: string) {
  if (!fecha) return "No disponible";
  return new Date(fecha).toLocaleDateString("es-BO");
}

function claseEstado(estado: string) {
  const clases: Record<string, string> = {
    PENDIENTE: "estado-pendiente",
    EN_REVISION: "estado-revision",
    PAGADO: "estado-pagado",
    RECHAZADO: "estado-rechazado",
    CONFIRMADO: "estado-confirmado",
    EN_PROCESO: "estado-proceso",
    ENVIADO: "estado-enviado",
    ENTREGADO: "estado-entregado",
  };

  return clases[estado] || "estado-pendiente";
}

const etapas = [
  {
    estado: "CONFIRMADO",
    nombre: "Pedido confirmado",
    icono: "pi-check-circle",
  },
  { estado: "EN_PROCESO", nombre: "En preparación", icono: "pi-box" },
  { estado: "ENVIADO", nombre: "Pedido enviado", icono: "pi-truck" },
  { estado: "ENTREGADO", nombre: "Pedido entregado", icono: "pi-home" },
];

function etapaActual(estado: string) {
  return etapas.findIndex((etapa) => etapa.estado === estado);
}

function pagoDelPedido(pedido: any) {
  return pedido.pagos?.length ? pedido.pagos[pedido.pagos.length - 1] : null;
}

onMounted(cargarPedidos);
</script>

<template>
  <main class="mis-pedidos">
    <section class="portada">
      <div class="contenedor">
        <span class="subtitulo">DECORA Y VIVE · MI CUENTA</span>
        <h1>Mis pedidos</h1>
        <p>Consulta tus compras y sigue cada etapa de preparación y entrega.</p>
      </div>
    </section>

    <section class="contenedor contenido-pedidos">
      <div class="encabezado-lista">
        <div>
          <h2>Historial de compras</h2>
          <p>Revisa el estado y los detalles de tus pedidos.</p>
        </div>

        <button
          class="btn-actualizar"
          @click="cargarPedidos"
          :disabled="cargando"
        >
          <i class="pi pi-refresh"></i>
          Actualizar
        </button>
      </div>

      <div v-if="error" class="mensaje error">
        <i class="pi pi-exclamation-circle"></i>
        {{ error }}
      </div>

      <div v-if="cargando" class="estado-vacio">
        <i class="pi pi-spin pi-spinner"></i>
        <p>Cargando tus pedidos...</p>
      </div>

      <div v-else-if="pedidos.length === 0" class="estado-vacio">
        <i class="pi pi-shopping-bag"></i>
        <h2>Aún no tienes pedidos</h2>
        <p>Cuando realices una compra, podrás consultar aquí su seguimiento.</p>
        <RouterLink to="/tienda" class="btn-tienda">
          Explorar tienda
        </RouterLink>
      </div>

      <div v-else>
        <article
          v-for="pedido in pedidos"
          :key="pedido.id_pedido"
          class="pedido-card"
        >
          <div class="pedido-cabecera">
            <div>
              <span class="subtitulo">NÚMERO DE PEDIDO</span>
              <h3>{{ pedido.numero_pedido }}</h3>
              <small
                >Fecha de compra: {{ formatoFecha(pedido.fecha_pedido) }}</small
              >
            </div>

            <span class="estado" :class="claseEstado(pedido.estado_pedido)">
              {{ pedido.estado_pedido }}
            </span>
          </div>

          <div class="pedido-cuerpo">
            <section class="seccion">
              <h4><i class="pi pi-box"></i> Productos de tu pedido</h4>

              <div
                v-for="detalle in pedido.detalles"
                :key="detalle.id_detalle_pedido"
                class="producto"
              >
                <img
                  v-if="detalle.productoColor?.producto?.fotografia"
                  :src="detalle.productoColor.producto.fotografia"
                  :alt="detalle.productoColor.producto.nombre"
                  class="foto-producto"
                />

                <div v-else class="foto-sin-imagen">
                  <i class="pi pi-image"></i>
                </div>

                <div class="producto-info">
                  <strong>
                    {{ detalle.productoColor?.producto?.nombre || "Producto" }}
                  </strong>
                  <small>
                    Color:
                    {{
                      detalle.productoColor?.color?.nombre || "No especificado"
                    }}
                  </small>
                  <small>Cantidad: {{ detalle.cantidad }}</small>
                </div>

                <div class="producto-precio">
                  <strong>
                    Bs {{ Number(detalle.precio_unitario).toFixed(2) }}
                  </strong>
                  <small>
                    Subtotal: Bs {{ Number(detalle.subtotal).toFixed(2) }}
                  </small>
                </div>
              </div>

              <div class="total">
                <span>Total de tu compra</span>
                <strong>Bs {{ Number(pedido.total).toFixed(2) }}</strong>
              </div>
            </section>

            <section class="seccion informacion">
              <div>
                <h4><i class="pi pi-map-marker"></i> Entrega</h4>
                <p>{{ pedido.direccion_entrega || "No disponible" }}</p>
              </div>

              <div>
                <h4><i class="pi pi-wallet"></i> Estado del pago</h4>

                <span
                  v-if="pagoDelPedido(pedido)"
                  class="estado"
                  :class="claseEstado(pagoDelPedido(pedido).estado_pago)"
                >
                  {{ pagoDelPedido(pedido).estado_pago }}
                </span>

                <span v-else class="texto-secundario">
                  Sin información de pago
                </span>
              </div>
            </section>

            <!-- AVISO CUANDO EL PAGO ES RECHAZADO -->
            <section
              v-if="pagoDelPedido(pedido)?.estado_pago === 'RECHAZADO'"
              class="aviso-rechazado"
            >
              <div class="aviso-icono">
                <i class="pi pi-exclamation-triangle"></i>
              </div>

              <div class="aviso-contenido">
                <h4>Tu pago no fue aprobado</h4>

                <p>
                  No te preocupes, estamos aquí para ayudarte. Comunícate con
                  nuestro equipo de atención al cliente para conocer el motivo
                  del rechazo y recibir orientación sobre cómo continuar con tu
                  compra.
                </p>

                <div class="contacto-telefono">
                  <i class="pi pi-phone"></i>
                  <div>
                    <small>Atención al cliente</small>
                    <strong>{{ telefonoVisible }}</strong>
                  </div>
                </div>

                <a :href="`tel:${telefono}`" class="btn-llamar">
                  <i class="pi pi-phone"></i>
                  Llamar a la tienda
                </a>
              </div>
            </section>

            <section class="seguimiento">
              <h4><i class="pi pi-truck"></i> Seguimiento de tu pedido</h4>

              <div
                v-if="pedido.estado_pedido === 'CANCELADO'"
                class="mensaje cancelado"
              >
                <i class="pi pi-times-circle"></i>
                Este pedido ha sido cancelado.
              </div>

              <div
                v-else-if="etapaActual(pedido.estado_pedido) >= 0"
                class="linea-tiempo"
              >
                <div
                  v-for="(etapa, indice) in etapas"
                  :key="etapa.estado"
                  class="etapa"
                  :class="{
                    completada: indice <= etapaActual(pedido.estado_pedido),
                    actual: indice === etapaActual(pedido.estado_pedido),
                  }"
                >
                  <div class="etapa-icono">
                    <i
                      :class="[
                        'pi',
                        indice <= etapaActual(pedido.estado_pedido)
                          ? 'pi-check'
                          : etapa.icono,
                      ]"
                    ></i>
                  </div>

                  <span>{{ etapa.nombre }}</span>
                </div>
              </div>

              <div v-else class="mensaje pendiente">
                <i class="pi pi-clock"></i>
                Tu pedido está pendiente de confirmación.
              </div>
            </section>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.mis-pedidos {
  min-height: 600px;
  background: #faf8f4;
  color: #49382e;
  padding-bottom: 55px;
}

.contenedor {
  width: min(1050px, 92%);
  margin: auto;
}

.portada {
  background: #49382e;
  color: white;
  padding: 42px 0;
}

.subtitulo {
  color: #ad8960;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
}

.portada h1 {
  font-family: "Playfair Display", serif;
  font-size: 34px;
  margin: 9px 0;
}

.portada p {
  color: #e1d7ca;
  font-size: 13px;
  margin: 0;
}

.contenido-pedidos {
  padding-top: 35px;
}

.encabezado-lista {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 22px;
}

.encabezado-lista h2 {
  font-family: "Playfair Display", serif;
  font-size: 23px;
  margin: 0 0 5px;
}

.encabezado-lista p {
  color: #8c8074;
  font-size: 12px;
  margin: 0;
}

.btn-actualizar,
.btn-tienda {
  background: #49382e;
  color: white;
  border: 0;
  padding: 11px 17px;
  font-size: 11px;
  text-decoration: none;
  cursor: pointer;
}

.btn-actualizar:hover,
.btn-tienda:hover {
  background: #ad8960;
  color: white;
}

.btn-actualizar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.pedido-card {
  background: white;
  border: 1px solid #eee8df;
  margin-bottom: 20px;
}

.pedido-cabecera {
  background: #f5f0e8;
  border-bottom: 1px solid #eee8df;
  padding: 17px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.pedido-cabecera h3 {
  font-family: "Playfair Display", serif;
  font-size: 20px;
  margin: 5px 0;
}

.pedido-cabecera small {
  font-size: 11px;
  color: #8c8074;
}

.pedido-cuerpo {
  padding: 20px;
}

.seccion {
  border-bottom: 1px solid #eee8df;
  padding-bottom: 18px;
  margin-bottom: 18px;
}

.seccion h4,
.seguimiento h4 {
  font-family: "Playfair Display", serif;
  font-size: 16px;
  margin: 0 0 14px;
}

.seccion h4 i,
.seguimiento h4 i {
  color: #ad8960;
  margin-right: 7px;
  font-size: 13px;
}

.producto {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 0;
  border-bottom: 1px solid #f1ede7;
}

.foto-producto,
.foto-sin-imagen {
  width: 75px;
  height: 68px;
  object-fit: contain;
  flex-shrink: 0;
  background: #faf8f4;
  border: 1px solid #eee8df;
}

.foto-sin-imagen {
  display: grid;
  place-items: center;
  color: #ad8960;
  font-size: 20px;
}

.producto-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
}

.producto-info strong,
.producto-precio strong {
  font-size: 12px;
}

.producto-info small,
.producto-precio small {
  color: #8c8074;
  font-size: 10px;
}

.producto-precio {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  text-align: right;
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 17px;
  font-size: 13px;
}

.total strong {
  font-size: 17px;
  color: #ad8960;
}

.informacion {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.informacion p {
  font-size: 12px;
  color: #75685c;
  margin: 0;
}

.texto-secundario {
  color: #8c8074;
  font-size: 11px;
}

.estado {
  display: inline-block;
  padding: 6px 10px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.estado-pendiente {
  background: #f5f0e8;
  color: #947345;
}

.estado-revision {
  background: #f8eddc;
  color: #a16d26;
}

.estado-pagado,
.estado-entregado {
  background: #e7f1e8;
  color: #367346;
}

.estado-rechazado {
  background: #f8e7e5;
  color: #a33c35;
}

.estado-confirmado {
  background: #e9edf5;
  color: #4d638b;
}

.estado-proceso {
  background: #e8eef5;
  color: #486c91;
}

.estado-enviado {
  background: #eee8f5;
  color: #73558f;
}

/* AVISO DE PAGO RECHAZADO */
.aviso-rechazado {
  display: flex;
  gap: 16px;
  padding: 20px;
  margin-bottom: 20px;
  background: #fff5f2;
  border: 1px solid #efd0c8;
  border-left: 4px solid #b94d40;
}

.aviso-icono {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #f8e3df;
  color: #a33c35;
  font-size: 20px;
}

.aviso-contenido h4 {
  font-family: "Playfair Display", serif;
  font-size: 17px;
  color: #a33c35;
  margin: 0 0 8px;
}

.aviso-contenido p {
  color: #75615b;
  font-size: 12px;
  line-height: 1.7;
  margin: 0 0 15px;
}

.contacto-telefono {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 14px;
  color: #49382e;
}

.contacto-telefono > i {
  color: #ad8960;
  font-size: 20px;
}

.contacto-telefono div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.contacto-telefono small {
  color: #8c8074;
  font-size: 10px;
}

.contacto-telefono strong {
  font-size: 14px;
}

.btn-llamar {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #49382e;
  color: white;
  text-decoration: none;
  padding: 10px 16px;
  font-size: 11px;
}

.btn-llamar:hover {
  background: #ad8960;
  color: white;
}

.linea-tiempo {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  position: relative;
  padding-top: 10px;
}

.etapa {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 9px;
  color: #a99e93;
  font-size: 10px;
  position: relative;
}

.etapa-icono {
  width: 35px;
  height: 35px;
  border: 1px solid #ddd5ca;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: white;
  font-size: 13px;
}

.etapa.completada {
  color: #496b4e;
  font-weight: 700;
}

.etapa.completada .etapa-icono {
  background: #e7f1e8;
  color: #367346;
  border-color: #b9d2bc;
}

.etapa.actual .etapa-icono {
  outline: 3px solid #e7f1e8;
}

.mensaje {
  padding: 13px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 9px;
}

.error {
  background: #f8e7e5;
  color: #a33c35;
  margin-bottom: 18px;
}

.pendiente {
  background: #f5f0e8;
  color: #947345;
}

.cancelado {
  background: #f8e7e5;
  color: #a33c35;
}

.estado-vacio {
  background: white;
  padding: 55px 20px;
  text-align: center;
  color: #8c8074;
}

.estado-vacio > i {
  font-size: 32px;
  color: #ad8960;
}

.estado-vacio h2 {
  font-family: "Playfair Display", serif;
  color: #49382e;
  font-size: 22px;
}

.estado-vacio p {
  font-size: 12px;
  margin-bottom: 22px;
}

@media (max-width: 600px) {
  .portada {
    padding: 32px 0;
  }

  .portada h1 {
    font-size: 28px;
  }

  .encabezado-lista {
    align-items: flex-start;
    flex-direction: column;
  }

  .pedido-cabecera {
    align-items: flex-start;
    flex-direction: column;
  }

  .producto {
    flex-wrap: wrap;
  }

  .producto-precio {
    width: 100%;
    align-items: flex-start;
    text-align: left;
    margin-left: 89px;
  }

  .informacion {
    grid-template-columns: 1fr;
  }

  .linea-tiempo {
    gap: 5px;
  }

  .etapa {
    font-size: 9px;
  }

  .etapa-icono {
    width: 30px;
    height: 30px;
  }

  .aviso-rechazado {
    padding: 14px;
    gap: 10px;
  }
}
</style>
