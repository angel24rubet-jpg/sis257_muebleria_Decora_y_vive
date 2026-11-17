<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

// LÓGICA INTACTA DE TU COMPAÑERO
const modulos = [
  { nombre: "Categorias", icono: "pi pi-list", ruta: "/categorias" },
  { nombre: "Colores", icono: "pi pi-palette", ruta: "/colores" },
  { nombre: "Productos", icono: "pi pi-box", ruta: "/productos" },
  { nombre: "Clientes", icono: "pi pi-users", ruta: "/clientes" },
  { nombre: "Ventas", icono: "pi pi-shopping-cart", ruta: "/ventas" },
  { nombre: "Reportes", icono: "pi pi-chart-bar", ruta: "/reportes" },
  { nombre: "Pedidos", icono: "pi pi-truck", ruta: "/pedidos" },
  { nombre: "Compras", icono: "pi pi-shopping-bag", ruta: "/compras" }
];

const abrirModulo = (ruta: string) => {
  router.push(ruta);
};
</script>

<template>
  <div>
    <!-- ============================================== -->
    <!-- 1. HERO CAROUSEL & BANNER (Plantilla Electro)  -->
    <!-- ============================================== -->
    <div class="container-fluid carousel bg-light px-0">
      <div class="row g-0 justify-content-end">
        
        <!-- Carrusel Principal -->
        <div class="col-12 col-lg-7 col-xl-9">
          <div class="p-5 text-center text-lg-start d-flex align-items-center bg-white" style="min-height: 400px;">
            <div class="row align-items-center w-100">
              <div class="col-md-6 text-center">
                <img src="/img/carousel-1.png" class="img-fluid animate__animated animate__fadeIn" alt="Sofá destacado" />
              </div>
              <div class="col-md-6 p-4">
                <h4 class="text-uppercase fw-bold text-secondary mb-3" style="letter-spacing: 2px;">Hasta 40% OFF</h4>
                <h1 class="display-4 text-capitalize mb-4 fw-bold">Elegancia y Confort para tu Hogar</h1>
                <p class="text-muted">Descubre nuestra nueva colección de salas y comedores modernos.</p>
                <RouterLink to="/productos" class="btn btn-primary rounded-pill py-3 px-5">Ver Catálogo</RouterLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Banner Promocional Lateral -->
        <div class="col-12 col-lg-5 col-xl-3">
          <div class="carousel-header-banner h-100 position-relative">
            <img src="/img/header-img.jpg" class="img-fluid w-100 h-100" style="object-fit: cover;" alt="Oferta especial" />
            <div class="carousel-banner-offer" style="position: absolute; top: 20px; left: 20px;">
              <p class="bg-primary text-white rounded fs-6 py-2 px-3 mb-0 me-2">Ahorra 25%</p>
              <p class="text-primary fs-6 fw-bold mb-0 bg-white p-1 rounded mt-1 text-center">Oferta del Mes</p>
            </div>
            <div class="carousel-banner text-center p-4" style="position: absolute; bottom: 20px; width: 100%;">
              <h4 class="text-white mb-2" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">Comedor Nórdico</h4>
              <p class="text-primary fs-4 fw-bold mb-3 bg-white d-inline-block px-3 rounded">$1,050.00</p><br>
              <RouterLink to="/productos" class="btn btn-primary rounded-pill py-2 px-4">
                <i class="fas fa-shopping-cart me-2"></i> Ver Detalles
              </RouterLink>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ============================================== -->
    <!-- 2. FRANJA DE BENEFICIOS (Plantilla Electro)    -->
    <!-- ============================================== -->
    <div class="container-fluid px-0 border-bottom border-top bg-white">
      <div class="row g-0">
        <div class="col-6 col-md-3 border-end p-4 d-flex align-items-center">
          <i class="fa fa-sync-alt fa-2x text-primary me-3"></i>
          <div>
            <h6 class="text-uppercase mb-1 text-dark">Garantía Total</h6>
            <small class="text-muted">30 días de satisfacción</small>
          </div>
        </div>
        <div class="col-6 col-md-3 border-end p-4 d-flex align-items-center">
          <i class="fas fa-truck fa-2x text-primary me-3"></i>
          <div>
            <h6 class="text-uppercase mb-1 text-dark">Envío Rápido</h6>
            <small class="text-muted">A todo el país</small>
          </div>
        </div>
        <div class="col-6 col-md-3 border-end p-4 d-flex align-items-center">
          <i class="fas fa-headset fa-2x text-primary me-3"></i>
          <div>
            <h6 class="text-uppercase mb-1 text-dark">Atención 24/7</h6>
            <small class="text-muted">Soporte personalizado</small>
          </div>
        </div>
        <div class="col-6 col-md-3 p-4 d-flex align-items-center">
          <i class="fas fa-shield-alt fa-2x text-primary me-3"></i>
          <div>
            <h6 class="text-uppercase mb-1 text-dark">Pago Seguro</h6>
            <small class="text-muted">Transacciones protegidas</small>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- 3. MÓDULOS ADMINISTRATIVOS (Tu compañero)      -->
    <!-- ============================================== -->
    <main class="contenedor py-5 bg-light" id="modulos-admin">
      <div class="container text-center">
        <h2 class="mb-4 border-bottom pb-2 d-inline-block text-dark">Módulos Administrativos</h2>
        
        <div class="modulos">
          <button
            v-for="modulo in modulos"
            :key="modulo.ruta"
            class="boton-modulo shadow-sm"
            @click="abrirModulo(modulo.ruta)"
          >
            <i :class="modulo.icono"></i>
            <span>{{ modulo.nombre }}</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ESTILOS DE TU COMPAÑERO CORREGIDOS PARA EVITAR CONFLICTOS */
.contenedor {
  min-height: 40vh;
}
.modulos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 30px auto;
}

/* El !important obliga al navegador a usar el color oscuro ignorando a la plantilla */
.boton-modulo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 30px;
  cursor: pointer;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  background: #ffffff !important;
  color: #212529 !important; 
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.boton-modulo i {
  font-size: 35px;
  color: #0dcaf0 !important; /* Color azulito de los íconos para que combinen */
}

/* Al pasar el ratón, invertimos los colores */
.boton-modulo:hover {
  background: #0dcaf0 !important;
  color: #ffffff !important;
  transform: translateY(-5px);
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}

.boton-modulo:hover i {
  color: #ffffff !important;
}
</style>