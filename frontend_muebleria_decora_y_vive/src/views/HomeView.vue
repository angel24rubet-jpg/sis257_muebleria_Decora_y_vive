<script setup lang="ts">
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

// Modulos administrativos
const modulos = [
  { nombre: "Categorias", icono: "pi pi-list", ruta: "/categorias" },
  { nombre: "Colores", icono: "pi pi-palette", ruta: "/colores" },
  { nombre: "Productos", icono: "pi pi-box", ruta: "/productos" },
  { nombre: "Clientes", icono: "pi pi-users", ruta: "/clientes" },
  { nombre: "Ventas", icono: "pi pi-shopping-cart", ruta: "/ventas" },
  { nombre: "Reportes", icono: "pi pi-chart-bar", ruta: "/reportes" },
  { nombre: "Pedidos", icono: "pi pi-truck", ruta: "/pedidos" },
];

const abrirModulo = (ruta: string) => {
  router.push(ruta);
};
</script>

<template>
  <div class="home-page">
    <!-- HERO PRINCIPAL -->
    <section class="container-fluid carousel bg-light px-0">
      <div class="row g-0">
        <!-- Banner principal -->
        <div class="col-12 col-lg-8 col-xl-9">
          <div class="hero-principal bg-white">
            <div class="row align-items-center w-100 g-3">
              <div class="col-12 col-md-6 text-center">
                <img
                  src="/img/carousel-1.png"
                  class="img-fluid hero-imagen"
                  alt="Sofa destacado"
                />
              </div>

              <div class="col-12 col-md-6 p-4 text-center text-md-start">
                <h4 class="text-uppercase fw-bold text-secondary mb-3">
                  Hasta 40% OFF
                </h4>

                <h1 class="display-4 text-capitalize mb-4 fw-bold">
                  Elegancia y Confort para tu Hogar
                </h1>

                <p class="text-muted">
                  Descubre nuestra nueva coleccion de salas y comedores
                  modernos.
                </p>

                <RouterLink
                  to="/productos"
                  class="btn btn-primary rounded-pill py-3 px-5"
                >
                  Ver Catalogo
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Banner promocional -->
        <div class="col-12 col-lg-4 col-xl-3">
          <div class="carousel-header-banner">
            <img
              src="/img/header-img.jpg"
              class="banner-imagen"
              alt="Oferta especial"
            />

            <div class="carousel-banner-offer">
              <p class="bg-primary text-white rounded fs-6 py-2 px-3 mb-2">
                Ahorra 25%
              </p>

              <p
                class="text-primary fs-6 fw-bold bg-white p-2 rounded text-center"
              >
                Oferta del Mes
              </p>
            </div>

            <div class="carousel-banner text-center">
              <h4 class="text-white mb-2">Comedor Nordico</h4>

              <p
                class="text-primary fs-4 fw-bold bg-white d-inline-block px-3 rounded"
              >
                $1,050.00
              </p>

              <div>
                <RouterLink
                  to="/productos"
                  class="btn btn-primary rounded-pill py-2 px-4"
                >
                  <i class="fas fa-shopping-cart me-2"></i>
                  Ver Detalles
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BENEFICIOS -->
    <section class="container-fluid px-0 border-bottom border-top bg-white">
      <div class="row g-0">
        <div class="col-6 col-md-3 border-end p-4 d-flex align-items-center">
          <i class="fa fa-sync-alt fa-2x text-primary me-3"></i>
          <div>
            <h6 class="text-uppercase mb-1 text-dark">Garantia Total</h6>
            <small class="text-muted">30 dias de satisfaccion</small>
          </div>
        </div>

        <div class="col-6 col-md-3 border-end p-4 d-flex align-items-center">
          <i class="fas fa-truck fa-2x text-primary me-3"></i>
          <div>
            <h6 class="text-uppercase mb-1 text-dark">Envio Rapido</h6>
            <small class="text-muted">A todo el pais</small>
          </div>
        </div>

        <div class="col-6 col-md-3 border-end p-4 d-flex align-items-center">
          <i class="fas fa-headset fa-2x text-primary me-3"></i>
          <div>
            <h6 class="text-uppercase mb-1 text-dark">Atencion 24/7</h6>
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
    </section>

    <!-- MODULOS ADMINISTRATIVOS -->
    <main
      v-if="auth.autenticado && auth.usuario?.rol === 'ADMINISTRADOR'"
      class="modulos-contenedor py-5 bg-light"
      id="modulos-admin"
    >
      <div class="container-fluid px-4 text-center">
        <h2 class="mb-4 border-bottom pb-2 d-inline-block text-dark">
          Modulos Administrativos
        </h2>

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

    <!-- ACCESO PARA CLIENTES -->
    <section
      v-else-if="auth.autenticado && auth.usuario?.rol === 'CLIENTE'"
      class="container py-5 text-center"
    >
      <h2>Bienvenido a Decora y Vive</h2>
      <p class="text-muted">
        Explora nuestro catalogo y encuentra los muebles ideales para tu hogar.
      </p>

      <RouterLink to="/tienda" class="btn btn-primary rounded-pill px-5 py-3">
        Ir a la tienda
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.hero-principal {
  width: 100%;
  min-height: 475px;
  padding: 35px;
  display: flex;
  align-items: center;
}

.hero-imagen {
  width: 100%;
  max-height: 380px;
  object-fit: contain;
}

.carousel-header-banner {
  width: 100%;
  height: 100%;
  min-height: 475px;
  position: relative;
  overflow: hidden;
}

.banner-imagen {
  width: 100%;
  height: 100%;
  min-height: 475px;
  position: absolute;
  inset: 0;
  object-fit: cover;
}

.carousel-banner-offer {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2;
}

.carousel-banner {
  position: absolute;
  bottom: 20px;
  width: 100%;
  padding: 20px;
  z-index: 2;
}

.modulos-contenedor {
  width: 100%;
  min-height: 40vh;
}

.modulos {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1400px;
  margin: 30px auto;
}

.boton-modulo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  min-height: 145px;
  padding: 25px;
  cursor: pointer;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  background: #ffffff;
  color: #212529;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.boton-modulo i {
  font-size: 35px;
  color: #0dcaf0;
}

.boton-modulo:hover {
  background: #0dcaf0;
  color: #ffffff;
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.boton-modulo:hover i {
  color: #ffffff;
}

@media (max-width: 991px) {
  .hero-principal {
    min-height: 400px;
  }

  .carousel-header-banner {
    min-height: 350px;
  }

  .banner-imagen {
    min-height: 350px;
  }

  .modulos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 575px) {
  .hero-principal {
    padding: 20px;
  }

  .hero-principal h1 {
    font-size: 2rem;
  }

  .modulos {
    grid-template-columns: 1fr;
  }

  .boton-modulo {
    min-height: 110px;
  }
}
</style>
