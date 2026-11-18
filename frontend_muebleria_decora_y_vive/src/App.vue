<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from "vue-router";
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

const esAdministrador = computed(
  () => auth.autenticado && auth.usuario?.rol === "ADMINISTRADOR",
);

const esCliente = computed(
  () => auth.autenticado && auth.usuario?.rol === "CLIENTE",
);

const rutaInicio = computed(() => {
  if (esAdministrador.value) return "/";
  return "/tienda";
});

function cerrarSesion() {
  auth.logout();
  router.push("/login");
}
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- 1. ENCABEZADO Y TOPBAR -->
    <header>
      <!-- Topbar Superior -->
      <div class="container-fluid px-5 d-none border-bottom d-lg-block">
        <div class="row gx-0 align-items-center">
          <div class="col-lg-4 text-center text-lg-start mb-lg-0">
            <div class="d-inline-flex align-items-center" style="height: 45px">
              <RouterLink :to="rutaInicio" class="text-muted me-2">
                Nosotros
              </RouterLink>
              <small> / </small>
              <RouterLink :to="rutaInicio" class="text-muted mx-2">
                Soporte
              </RouterLink>
              <small> / </small>
              <RouterLink :to="rutaInicio" class="text-muted ms-2">
                Contacto
              </RouterLink>
            </div>
          </div>

          <div
            class="col-lg-4 text-center d-flex align-items-center justify-content-center"
          >
            <small class="text-dark me-1">Teléfono:</small>
            <a href="tel:+59177126603" class="text-muted"> +591 77126603 </a>
          </div>

          <div class="col-lg-4 text-center text-lg-end">
            <div class="d-inline-flex align-items-center" style="height: 45px">
              <template v-if="auth.autenticado">
                <span class="text-muted me-3">
                  <i class="fa fa-user me-2"></i>
                  {{ auth.usuario?.nombre_completo }}
                </span>

                <button
                  class="btn btn-link text-muted p-0"
                  @click="cerrarSesion"
                >
                  Cerrar sesión
                </button>
              </template>

              <RouterLink v-else to="/login" class="text-muted ms-2">
                <i class="fa fa-user me-2"></i>
                Mi Cuenta / Acceso
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Barra de marca, buscador y carrito -->
      <div class="container-fluid px-5 py-4 d-none d-lg-block">
        <div class="row gx-0 align-items-center text-center">
          <div class="col-md-4 col-lg-4 text-center text-lg-start">
            <RouterLink :to="rutaInicio" class="navbar-brand p-0">
              <h1 class="h2 text-primary m-0 fw-bold">
                <i class="fas fa-couch text-secondary me-2"></i>
                Decora y Vive
              </h1>
            </RouterLink>
          </div>

          <div class="col-md-4 col-lg-5 text-center">
            <div class="position-relative ps-4">
              <div class="d-flex border rounded-pill">
                <input
                  class="form-control border-0 rounded-pill w-100 py-3"
                  type="text"
                  placeholder="¿Qué mueble buscas?"
                />

                <button
                  type="button"
                  class="btn btn-primary rounded-pill py-3 px-5"
                  style="border: 0"
                >
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-lg-3 text-center text-lg-end">
            <div class="d-inline-flex align-items-center">
              <RouterLink
                to="/carrito"
                class="text-muted d-flex align-items-center justify-content-center text-decoration-none"
              >
                <span class="rounded-circle btn-md-square border">
                  <i class="fas fa-shopping-cart"></i>
                </span>
                <span class="text-dark ms-2 fw-bold">Carrito</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Barra de navegación principal -->
      <div class="container-fluid nav-bar p-0">
        <div class="row gx-0 bg-primary px-5 align-items-center">
          <div class="col-12">
            <nav class="navbar navbar-expand-lg navbar-light bg-primary">
              <RouterLink
                :to="rutaInicio"
                class="navbar-brand d-block d-lg-none"
              >
                <h1 class="h3 text-white m-0">Decora y Vive</h1>
              </RouterLink>

              <button
                class="navbar-toggler ms-auto"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
              >
                <span class="fa fa-bars fa-1x text-white"></span>
              </button>

              <div class="collapse navbar-collapse" id="navbarCollapse">
                <!-- MENU ADMINISTRADOR -->
                <div v-if="esAdministrador" class="navbar-nav me-auto py-0">
                  <RouterLink
                    to="/"
                    class="nav-item nav-link"
                    active-class="active"
                  >
                    Inicio
                  </RouterLink>

                  <RouterLink
                    to="/productos"
                    class="nav-item nav-link"
                    active-class="active"
                  >
                    Productos
                  </RouterLink>

                  <RouterLink
                    to="/categorias"
                    class="nav-item nav-link"
                    active-class="active"
                  >
                    Categorías
                  </RouterLink>

                  <RouterLink
                    to="/colores"
                    class="nav-item nav-link"
                    active-class="active"
                  >
                    Colores
                  </RouterLink>

                  <RouterLink
                    to="/clientes"
                    class="nav-item nav-link"
                    active-class="active"
                  >
                    Clientes
                  </RouterLink>

                  <RouterLink
                    to="/ventas"
                    class="nav-item nav-link"
                    active-class="active"
                  >
                    Ventas
                  </RouterLink>

                  <RouterLink
                    to="/reportes"
                    class="nav-item nav-link"
                    active-class="active"
                  >
                    Reportes
                  </RouterLink>

                  <RouterLink
                    to="/pedidos"
                    class="nav-item nav-link"
                    active-class="active"
                  >
                    Pedidos
                  </RouterLink>
                </div>

                <!-- MENU CLIENTE -->
                <div v-else-if="esCliente" class="navbar-nav me-auto py-0">
                  <RouterLink
                    to="/tienda"
                    class="nav-item nav-link"
                    active-class="active"
                  >
                    Tienda
                  </RouterLink>

                  <RouterLink
                    to="/carrito"
                    class="nav-item nav-link"
                    active-class="active"
                  >
                    Mi carrito
                  </RouterLink>
                </div>

                <!-- MENU VISITANTE -->
                <div v-else class="navbar-nav me-auto py-0">
                  <RouterLink
                    to="/tienda"
                    class="nav-item nav-link"
                    active-class="active"
                  >
                    Tienda
                  </RouterLink>

                  <RouterLink to="/login" class="nav-item nav-link">
                    Iniciar sesión
                  </RouterLink>

                  <RouterLink to="/registro" class="nav-item nav-link">
                    Registrarse
                  </RouterLink>
                </div>

                <a
                  href="tel:+59177126603"
                  class="btn btn-secondary rounded-pill py-2 px-4"
                >
                  <i class="fa fa-phone-alt me-2"></i>
                  +591 77126603
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>

    <!-- 2. VISTA DINÁMICA -->
    <main class="flex-grow-1">
      <RouterView />
    </main>

    <!-- 3. FOOTER GLOBAL -->
    <footer class="container-fluid footer py-5 bg-dark text-white-50 mt-auto">
      <div class="container py-5">
        <div
          class="row g-4 rounded mb-5 p-4"
          style="background: rgba(255, 255, 255, 0.03)"
        >
          <div class="col-md-6 col-lg-4">
            <div class="d-flex align-items-center">
              <i class="fas fa-map-marker-alt fa-2x text-primary me-3"></i>
              <div>
                <h5 class="text-white mb-1">Ubicación</h5>
                <p class="mb-0">Sucre, Bolivia</p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4">
            <div class="d-flex align-items-center">
              <i class="fas fa-envelope fa-2x text-primary me-3"></i>
              <div>
                <h5 class="text-white mb-1">Email</h5>
                <p class="mb-0">coa.veliz.diegoarmando@usfx.bo</p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4">
            <div class="d-flex align-items-center">
              <i class="fa fa-phone-alt fa-2x text-primary me-3"></i>
              <div>
                <h5 class="text-white mb-1">Teléfono</h5>
                <p class="mb-0">+591 77126603</p>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center pb-3">
          <small>
            &copy; 2026 Mueblería Decora y Vive. Todos los derechos reservados.
          </small>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
#app {
  max-width: 100% !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow-x: hidden;
}
</style>
