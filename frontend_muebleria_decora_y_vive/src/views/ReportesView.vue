<script setup lang="ts">
import { ref } from "vue";
import { generarReporteVentas } from "@/services/reporteService";

const fechaInicio = ref("");
const fechaFin = ref("");

const reporte = ref<any>(null);
const cargando = ref(false);
const mensaje = ref("");

// Convertir fecha YYYY-MM-DD a DD/MM/YYYY
const convertirFecha = (fecha: string) => {
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
};

// Generar reporte
const consultarReporte = async () => {
  try {
    mensaje.value = "";
    reporte.value = null;

    if (!fechaInicio.value || !fechaFin.value) {
      mensaje.value = "Debe seleccionar ambas fechas";
      return;
    }

    if (fechaInicio.value > fechaFin.value) {
      mensaje.value = "La fecha inicial no puede ser mayor que la final";
      return;
    }

    cargando.value = true;

    reporte.value = await generarReporteVentas(
      convertirFecha(fechaInicio.value),
      convertirFecha(fechaFin.value),
    );
  } catch (error: any) {
    console.error("Error al generar reporte:", error);

    mensaje.value =
      error.response?.data?.message || "No se pudo generar el reporte";
  } finally {
    cargando.value = false;
  }
};
</script>

<template>
  <div class="container-fluid p-4">
    <h2>Reportes de Ventas</h2>

    <p>Consulta los indicadores de ventas de Mueblería Decora y Vive.</p>

    <!-- Filtros -->
    <div class="card shadow-sm p-4 mt-4">
      <h5 class="mb-3">Filtrar por periodo</h5>

      <div class="row">
        <div class="col-md-4 mb-3">
          <label class="form-label">Fecha inicial</label>

          <input
            v-model="fechaInicio"
            type="date"
            class="form-control"
            required
          />
        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">Fecha final</label>

          <input
            v-model="fechaFin"
            type="date"
            class="form-control"
            :min="fechaInicio || undefined"
            required
          />
        </div>

        <div class="col-md-4 d-flex align-items-end mb-3">
          <button
            class="btn btn-primary w-100"
            @click="consultarReporte"
            :disabled="cargando"
          >
            {{ cargando ? "Generando..." : "Generar reporte" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Mensaje -->
    <div v-if="mensaje" class="alert alert-info mt-3">
      {{ mensaje }}
    </div>

    <!-- Resultados -->
    <div v-if="reporte && reporte.indicadores" class="mt-4">
      <h4>Resultados del reporte</h4>

      <p>
        Periodo:
        {{ reporte.periodo.fecha_inicio }}
        al
        {{ reporte.periodo.fecha_fin }}
      </p>

      <!-- Indicadores -->
      <div class="row mt-3">
        <div class="col-md-4 mb-3">
          <div class="card shadow-sm p-3 h-100">
            <h6>Ventas realizadas</h6>
            <h3>{{ reporte.indicadores.ventas_realizadas }}</h3>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card shadow-sm p-3 h-100">
            <h6>Ingresos totales</h6>
            <h3>Bs. {{ reporte.indicadores.ingresos }}</h3>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card shadow-sm p-3 h-100">
            <h6>Descuentos aplicados</h6>
            <h3>Bs. {{ reporte.indicadores.descuentos }}</h3>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card shadow-sm p-3 h-100">
            <h6>Unidades vendidas</h6>
            <h3>
              {{ reporte.indicadores.unidades_vendidas }}
            </h3>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card shadow-sm p-3 h-100">
            <h6>Promedio por venta</h6>
            <h3>Bs. {{ reporte.indicadores.promedio_por_venta }}</h3>
          </div>
        </div>
      </div>

      <!-- Tabla resumen -->
      <div class="card shadow-sm mt-3">
        <div class="card-body">
          <h5>Resumen del periodo</h5>

          <table class="table table-bordered mt-3">
            <tbody>
              <tr>
                <th>Ventas realizadas</th>
                <td>
                  {{ reporte.indicadores.ventas_realizadas }}
                </td>
              </tr>

              <tr>
                <th>Ingresos</th>
                <td>Bs. {{ reporte.indicadores.ingresos }}</td>
              </tr>

              <tr>
                <th>Descuentos</th>
                <td>Bs. {{ reporte.indicadores.descuentos }}</td>
              </tr>

              <tr>
                <th>Unidades vendidas</th>
                <td>
                  {{ reporte.indicadores.unidades_vendidas }}
                </td>
              </tr>

              <tr>
                <th>Promedio por venta</th>
                <td>Bs. {{ reporte.indicadores.promedio_por_venta }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
