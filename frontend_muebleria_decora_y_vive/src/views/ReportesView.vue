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
  <div class="reportes-page container-fluid px-4 py-4">
    <!-- Encabezado -->
    <div class="page-header mb-4">
      <div>
        <span class="section-label">ANÁLISIS DEL NEGOCIO</span>
        <h2>Reportes de ventas</h2>
        <p>Consulta y analiza el rendimiento de Mueblería Decora y Vive.</p>
      </div>

      <div class="header-icon">
        <i class="bi bi-bar-chart-line"></i>
      </div>
    </div>

    <!-- Filtros -->
    <div class="report-card filter-card mb-4">
      <div class="card-heading">
        <div class="heading-icon">
          <i class="bi bi-calendar3"></i>
        </div>
        <div>
          <h5>Filtrar por periodo</h5>
          <small>Selecciona el rango de fechas para generar tu reporte.</small>
        </div>
      </div>

      <div class="row align-items-end mt-4">
        <div class="col-md-4 mb-3">
          <label class="form-label">Fecha inicial</label>
          <input
            v-model="fechaInicio"
            type="date"
            class="form-control custom-input"
            required
          />
        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">Fecha final</label>
          <input
            v-model="fechaFin"
            type="date"
            class="form-control custom-input"
            :min="fechaInicio || undefined"
            required
          />
        </div>

        <div class="col-md-4 mb-3">
          <button
            class="btn btn-gold w-100"
            @click="consultarReporte"
            :disabled="cargando"
          >
            <i
              :class="cargando ? 'bi bi-hourglass-split' : 'bi bi-search'"
              class="me-2"
            ></i>
            {{ cargando ? "Generando reporte..." : "Generar reporte" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Mensaje -->
    <div v-if="mensaje" class="alert custom-alert mt-3">
      <i class="bi bi-exclamation-circle me-2"></i>
      {{ mensaje }}
    </div>

    <!-- Resultados -->
    <div v-if="reporte && reporte.indicadores" class="results-section">
      <!-- Periodo consultado -->
      <div class="results-header mb-3">
        <div>
          <span class="section-label">RESULTADOS</span>
          <h4>Resumen del reporte</h4>
        </div>

        <div class="period-badge">
          <i class="bi bi-calendar-check me-2"></i>
          {{ reporte.periodo.fecha_inicio }}
          <span class="mx-1">—</span>
          {{ reporte.periodo.fecha_fin }}
        </div>
      </div>

      <!-- Indicadores -->
      <div class="row">
        <div class="col-xl-4 col-md-6 mb-3">
          <div class="indicator-card">
            <div class="indicator-top">
              <div class="indicator-icon icon-brown">
                <i class="bi bi-receipt"></i>
              </div>
              <span class="indicator-label">Actividad</span>
            </div>
            <div class="indicator-title">Ventas realizadas</div>
            <div class="indicator-value">
              {{ reporte.indicadores.ventas_realizadas }}
            </div>
            <div class="indicator-description">
              Cantidad de ventas registradas
            </div>
          </div>
        </div>

        <div class="col-xl-4 col-md-6 mb-3">
          <div class="indicator-card">
            <div class="indicator-top">
              <div class="indicator-icon icon-gold">
                <i class="bi bi-cash-stack"></i>
              </div>
              <span class="indicator-label">Ingresos</span>
            </div>
            <div class="indicator-title">Ingresos totales</div>
            <div class="indicator-value">
              Bs. {{ reporte.indicadores.ingresos }}
            </div>
            <div class="indicator-description">
              Total generado por las ventas
            </div>
          </div>
        </div>

        <div class="col-xl-4 col-md-6 mb-3">
          <div class="indicator-card">
            <div class="indicator-top">
              <div class="indicator-icon icon-cream">
                <i class="bi bi-tags"></i>
              </div>
              <span class="indicator-label">Descuentos</span>
            </div>
            <div class="indicator-title">Descuentos aplicados</div>
            <div class="indicator-value">
              Bs. {{ reporte.indicadores.descuentos }}
            </div>
            <div class="indicator-description">
              Descuentos otorgados a clientes
            </div>
          </div>
        </div>

        <div class="col-xl-6 col-md-6 mb-3">
          <div class="indicator-card">
            <div class="indicator-top">
              <div class="indicator-icon icon-brown">
                <i class="bi bi-box-seam"></i>
              </div>
              <span class="indicator-label">Productos</span>
            </div>
            <div class="indicator-title">Unidades vendidas</div>
            <div class="indicator-value">
              {{ reporte.indicadores.unidades_vendidas }}
            </div>
            <div class="indicator-description">
              Total de unidades comercializadas
            </div>
          </div>
        </div>

        <div class="col-xl-6 col-md-6 mb-3">
          <div class="indicator-card">
            <div class="indicator-top">
              <div class="indicator-icon icon-gold">
                <i class="bi bi-graph-up-arrow"></i>
              </div>
              <span class="indicator-label">Promedio</span>
            </div>
            <div class="indicator-title">Promedio por venta</div>
            <div class="indicator-value">
              Bs. {{ reporte.indicadores.promedio_por_venta }}
            </div>
            <div class="indicator-description">
              Ingreso promedio por cada venta
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla resumen -->
      <div class="report-card table-card mt-3">
        <div class="card-heading">
          <div class="heading-icon">
            <i class="bi bi-list-ul"></i>
          </div>
          <div>
            <h5>Detalle de indicadores</h5>
            <small>Información consolidada del periodo seleccionado.</small>
          </div>
        </div>

        <div class="table-responsive mt-4">
          <table class="table report-table align-middle">
            <thead>
              <tr>
                <th>Indicador</th>
                <th class="text-end">Resultado</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <i class="bi bi-receipt me-2"></i>
                  Ventas realizadas
                </td>
                <td class="text-end fw-semibold">
                  {{ reporte.indicadores.ventas_realizadas }}
                </td>
              </tr>

              <tr>
                <td>
                  <i class="bi bi-cash-stack me-2"></i>
                  Ingresos totales
                </td>
                <td class="text-end fw-semibold">
                  Bs. {{ reporte.indicadores.ingresos }}
                </td>
              </tr>

              <tr>
                <td>
                  <i class="bi bi-tags me-2"></i>
                  Descuentos aplicados
                </td>
                <td class="text-end fw-semibold">
                  Bs. {{ reporte.indicadores.descuentos }}
                </td>
              </tr>

              <tr>
                <td>
                  <i class="bi bi-box-seam me-2"></i>
                  Unidades vendidas
                </td>
                <td class="text-end fw-semibold">
                  {{ reporte.indicadores.unidades_vendidas }}
                </td>
              </tr>

              <tr>
                <td>
                  <i class="bi bi-graph-up-arrow me-2"></i>
                  Promedio por venta
                </td>
                <td class="text-end fw-semibold">
                  Bs. {{ reporte.indicadores.promedio_por_venta }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Estado inicial -->
    <div v-if="!reporte && !mensaje && !cargando" class="empty-state mt-4">
      <div class="empty-icon">
        <i class="bi bi-clipboard-data"></i>
      </div>
      <h5>Consulta tus reportes de ventas</h5>
      <p>
        Selecciona una fecha inicial y final para visualizar los indicadores de
        tu negocio.
      </p>
    </div>
  </div>
</template>

<style scoped>
.reportes-page {
  min-height: 100%;
  background: #f8f5f0;
  color: #49372b;
}

/* Encabezado */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-label {
  display: inline-block;
  color: #a17b45;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-bottom: 7px;
}

.page-header h2 {
  color: #49372b;
  font-size: 27px;
  font-weight: 750;
  margin-bottom: 5px;
}

.page-header p {
  color: #938477;
  margin: 0;
  font-size: 14px;
}

.header-icon {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  background: #eee4d6;
  color: #8b6842;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 27px;
}

/* Tarjetas principales */
.report-card {
  background: #fff;
  border: 1px solid #eee6dc;
  border-radius: 14px;
  padding: 23px;
  box-shadow: 0 3px 12px rgba(73, 55, 43, 0.04);
}

.card-heading {
  display: flex;
  align-items: center;
  gap: 13px;
}

.heading-icon {
  width: 43px;
  height: 43px;
  border-radius: 12px;
  background: #f1e9de;
  color: #886641;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.card-heading h5 {
  color: #49372b;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px;
}

.card-heading small {
  color: #988a7c;
  font-size: 12px;
}

/* Filtros */
.form-label {
  color: #665344;
  font-size: 13px;
  font-weight: 650;
  margin-bottom: 8px;
}

.custom-input {
  height: 44px;
  border: 1px solid #e5dbcf;
  border-radius: 9px;
  color: #49372b;
  font-size: 13px;
  background-color: #fdfcfb;
}

.custom-input:focus {
  border-color: #b08a55;
  box-shadow: 0 0 0 3px rgba(176, 138, 85, 0.12);
}

.btn-gold {
  height: 44px;
  border: none;
  border-radius: 9px;
  background: #806044;
  color: #fff;
  font-size: 13px;
  font-weight: 650;
  transition: all 0.2s ease;
}

.btn-gold:hover:not(:disabled) {
  background: #634832;
  color: #fff;
  transform: translateY(-1px);
}

.btn-gold:disabled {
  opacity: 0.7;
}

/* Mensaje */
.custom-alert {
  background: #f5eadb;
  color: #795632;
  border: 1px solid #e9d8c2;
  border-radius: 10px;
  font-size: 13px;
}

/* Resultados */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.results-header h4 {
  color: #49372b;
  font-size: 20px;
  font-weight: 750;
  margin: 0;
}

.period-badge {
  padding: 9px 14px;
  border-radius: 9px;
  background: #eee5d9;
  color: #75583c;
  font-size: 12px;
  font-weight: 650;
}

/* Indicadores */
.indicator-card {
  height: 100%;
  min-height: 160px;
  background: #fff;
  border: 1px solid #eee6dc;
  border-radius: 13px;
  padding: 19px;
  box-shadow: 0 3px 12px rgba(73, 55, 43, 0.04);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.indicator-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 18px rgba(73, 55, 43, 0.08);
}

.indicator-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.indicator-icon {
  width: 39px;
  height: 39px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
}

.icon-brown {
  background: #eee5dc;
  color: #78563b;
}

.icon-gold {
  background: #f5edda;
  color: #a17b35;
}

.icon-cream {
  background: #f2e9e3;
  color: #9a7055;
}

.indicator-label {
  color: #a09284;
  font-size: 11px;
  font-weight: 650;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.indicator-title {
  color: #857568;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
}

.indicator-value {
  color: #49372b;
  font-size: 25px;
  font-weight: 750;
  overflow-wrap: anywhere;
}

.indicator-description {
  color: #a3988e;
  font-size: 11px;
  margin-top: 5px;
}

/* Tabla */
.table-card {
  padding: 23px;
}

.report-table {
  margin-bottom: 0;
  color: #665344;
  font-size: 13px;
}

.report-table thead th {
  padding: 13px 15px;
  background: #f5f0e9;
  color: #75583c;
  font-size: 12px;
  font-weight: 700;
  border-bottom: 1px solid #e9dfd3;
}

.report-table tbody td {
  padding: 14px 15px;
  border-color: #f0eae3;
}

.report-table tbody td i {
  color: #a17b45;
}

.report-table tbody tr:hover {
  background: #fcfaf7;
}

/* Estado inicial */
.empty-state {
  background: #fff;
  border: 1px dashed #dfd1c0;
  border-radius: 14px;
  padding: 45px 20px;
  text-align: center;
}

.empty-icon {
  width: 65px;
  height: 65px;
  margin: 0 auto 15px;
  border-radius: 18px;
  background: #f1e9de;
  color: #8b6842;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 29px;
}

.empty-state h5 {
  color: #49372b;
  font-weight: 700;
  font-size: 16px;
}

.empty-state p {
  max-width: 420px;
  margin: 7px auto 0;
  color: #9a8d81;
  font-size: 13px;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .reportes-page {
    padding: 18px !important;
  }

  .page-header h2 {
    font-size: 22px;
  }

  .header-icon {
    width: 48px;
    height: 48px;
    font-size: 22px;
  }

  .report-card {
    padding: 17px;
  }

  .results-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .indicator-value {
    font-size: 22px;
  }
}
</style>
