<script setup lang="ts">
import { RouterView, RouterLink, useRouter, useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useCarritoStore } from "@/stores/carrito";

const auth = useAuthStore();
const carrito = useCarritoStore();
const router = useRouter();
const route = useRoute();

const menuUsuarioAbierto = ref(false);

const esAdministrador = computed(
  () => auth.autenticado && auth.usuario?.rol === "ADMINISTRADOR",
);

const esRutaAuth = computed(
  () => route.path === "/login" || route.path === "/registro",
);

function cerrarSesion() {
  menuUsuarioAbierto.value = false;
  auth.logout();
  router.push("/login");
}

onMounted(() => {
  if (typeof (window as any).WOW !== "undefined") {
    new (window as any).WOW({ live: false }).init();
  }
});
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Cabecera (Oculta en Login y Registro) -->
    <template v-if="!esRutaAuth">
      <!-- Barra Intermedia (Logo, Buscador y Carrito) -->
      <div class="container-fluid px-5 py-4 d-none d-lg-block">
        <div class="row gx-0 align-items-center text-center">
          <div class="col-md-4 col-lg-3 text-center text-lg-start">
            <div class="d-inline-flex align-items-center">
              <RouterLink to="/" class="navbar-brand p-0">
                <h1 class="display-5 text-primary m-0">
                  <i class="fas fa-shopping-bag text-secondary me-2"></i>Decora y Vive
                </h1>
              </RouterLink>
            </div>
          </div>
          <div class="col-md-4 col-lg-6 text-center">
            <div class="position-relative ps-4">
              <div class="d-flex border rounded-pill">
                <input class="form-control border-0 rounded-pill w-100 py-3" type="text"
                  placeholder="¿Qué mueble buscas?" />
                <select class="form-select text-dark border-0 border-start rounded-0 p-3" style="width: 200px">
                  <option value="All Category">Todas las Categorías</option>
                  <option value="1">Salas</option>
                  <option value="2">Comedores</option>
                  <option value="3">Dormitorios</option>
                </select>
                <button type="button" class="btn btn-primary rounded-pill py-3 px-5" style="border: 0">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-4 col-lg-3 text-center text-lg-end">
            <div class="d-inline-flex align-items-center">
              <a href="#" class="text-muted d-flex align-items-center justify-content-center me-3">
                <span class="rounded-circle btn-md-square border">
                  <i class="fas fa-random"></i>
                </span>
              </a>
              <a href="#" class="text-muted d-flex align-items-center justify-content-center me-3">
                <span class="rounded-circle btn-md-square border">
                  <i class="fas fa-heart"></i>
                </span>
              </a>
              <RouterLink to="/carrito"
                class="text-muted d-flex align-items-center justify-content-center text-decoration-none"
                style="cursor: pointer;">
                <span class="rounded-circle btn-md-square border">
                  <i class="fas fa-shopping-cart"></i>
                </span>
                <span class="text-dark ms-2 fw-bold">
                  Carrito ({{ carrito.cantidadProductos }})
                </span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Navbar Naranja -->
      <div class="container-fluid nav-bar p-0">
        <div class="row gx-0 bg-primary px-5 align-items-center">
          <div class="col-lg-3 d-none d-lg-block">
            <nav class="navbar navbar-light position-relative" style="width: 250px">
              <button class="navbar-toggler border-0 fs-4 w-100 px-0 text-start" type="button" data-bs-toggle="collapse"
                data-bs-target="#allCat">
                <h4 class="m-0"><i class="fa fa-bars me-2"></i>All Categories</h4>
              </button>
              <div class="collapse navbar-collapse rounded-bottom" id="allCat">
                <div class="navbar-nav ms-auto py-0">
                  <ul class="list-unstyled categories-bars">
                    <li>
                      <div class="categories-bars-item">
                        <a href="#">Salas</a>
                        <span>(3)</span>
                      </div>
                    </li>
                    <li>
                      <div class="categories-bars-item">
                        <a href="#">Comedores</a>
                        <span>(5)</span>
                      </div>
                    </li>
                    <li>
                      <div class="categories-bars-item">
                        <a href="#">Dormitorios</a>
                        <span>(2)</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>

          <div class="col-12 col-lg-9">
            <nav class="navbar navbar-expand-lg navbar-light bg-primary">
              <RouterLink to="/" class="navbar-brand d-block d-lg-none">
                <h1 class="display-5 text-secondary m-0">
                  <i class="fas fa-shopping-bag text-white me-2"></i>Decora
                </h1>
              </RouterLink>
              <button class="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse">
                <span class="fa fa-bars fa-1x"></span>
              </button>

              <div class="collapse navbar-collapse" id="navbarCollapse">
                <div class="navbar-nav ms-auto py-0">
                  <RouterLink to="/" class="nav-item nav-link" active-class="active">
                    Home
                  </RouterLink>
                  <RouterLink to="/tienda" class="nav-item nav-link" active-class="active">
                    Shop
                  </RouterLink>
                  <RouterLink to="/producto" class="nav-item nav-link" active-class="active">
                    Single Page
                  </RouterLink>

                  <div class="nav-item dropdown">
                    <a href="#" class="nav-link" data-bs-toggle="dropdown">
                      <span class="dropdown-toggle">Pages</span>
                    </a>
                    <div class="dropdown-menu m-0">
                      <RouterLink to="/bestseller" class="dropdown-item">Bestseller</RouterLink>
                      <RouterLink to="/carrito" class="dropdown-item">Cart Page</RouterLink>
                      <RouterLink to="/checkout" class="dropdown-item">Checkout</RouterLink>

                      <!-- Solo visible para ADMINISTRADOR -->
                      <template v-if="esAdministrador">
                        <div class="dropdown-divider"></div>
                        <RouterLink to="/productos" class="dropdown-item">Admin: Productos</RouterLink>
                        <RouterLink to="/categorias" class="dropdown-item">Admin: Categorías</RouterLink>
                        <RouterLink to="/colores" class="dropdown-item">Admin: Colores</RouterLink>
                        <RouterLink to="/clientes" class="dropdown-item">Admin: Clientes</RouterLink>
                        <RouterLink to="/ventas" class="dropdown-item">Admin: Ventas</RouterLink>
                        <RouterLink to="/reportes" class="dropdown-item">Admin: Reportes</RouterLink>
                        <RouterLink to="/pedidos" class="dropdown-item">Admin: Pedidos</RouterLink>
                      </template>
                    </div>
                  </div>
                  <a href="#" class="nav-item nav-link me-2">Contact</a>
                </div>

                <!-- BOTÓN ROJO: Usuario Logueado o Login -->
                <div v-if="auth.autenticado" class="dropdown position-relative mb-3 mb-md-3 mb-lg-0">
                  <button class="btn btn-secondary rounded-pill py-2 px-4 px-lg-3 dropdown-toggle text-white"
                    type="button" @click="menuUsuarioAbierto = !menuUsuarioAbierto">
                    <i class="fa fa-user me-2"></i>
                    {{ auth.usuario?.nombre_completo?.split(" ")[0] }}
                  </button>

                  <div class="dropdown-menu dropdown-menu-end m-0" :class="{ show: menuUsuarioAbierto }"
                    style="right: 0; left: auto;">
                    <span class="dropdown-item-text small text-muted">
                      Rol: <strong>{{ auth.usuario?.rol }}</strong>
                    </span>
                    <div class="dropdown-divider"></div>
                    <button @click="cerrarSesion" class="dropdown-item text-danger">
                      <i class="fas fa-sign-out-alt me-2"></i> Cerrar sesión
                    </button>
                  </div>
                </div>

                <RouterLink v-else to="/login"
                  class="btn btn-secondary rounded-pill py-2 px-4 px-lg-3 mb-3 mb-md-3 mb-lg-0 text-white">
                  <i class="fa fa-user me-2"></i> Iniciar Sesión
                </RouterLink>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </template>

    <!-- VISTA DINÁMICA -->
    <main class="flex-grow-1">
      <RouterView />
    </main>

    <!-- Footer (Oculto en Login y Registro) -->
    <template v-if="!esRutaAuth">
      <div class="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.2s">
        <div class="container py-5">
          <div class="row g-4 rounded mb-5" style="background: rgba(255, 255, 255, 0.03)">
            <div class="col-md-6 col-lg-6 col-xl-3">
              <div class="rounded p-4">
                <div class="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-4"
                  style="width: 70px; height: 70px">
                  <i class="fas fa-map-marker-alt fa-2x text-primary"></i>
                </div>
                <div>
                  <h4 class="text-white">Ubicación</h4>
                  <p class="mb-2">Sucre, Bolivia</p>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-6 col-xl-3">
              <div class="rounded p-4">
                <div class="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-4"
                  style="width: 70px; height: 70px">
                  <i class="fas fa-envelope fa-2x text-primary"></i>
                </div>
                <div>
                  <h4 class="text-white">Email</h4>
                  <p class="mb-2">coa.veliz.diegoarmando@usfx.bo</p>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-6 col-xl-3">
              <div class="rounded p-4">
                <div class="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-4"
                  style="width: 70px; height: 70px">
                  <i class="fa fa-phone-alt fa-2x text-primary"></i>
                </div>
                <div>
                  <h4 class="text-white">Teléfono</h4>
                  <p class="mb-2">+591 77126603</p>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-6 col-xl-3">
              <div class="rounded p-4">
                <div class="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-4"
                  style="width: 70px; height: 70px">
                  <i class="fab fa-firefox-browser fa-2x text-primary"></i>
                </div>
                <div>
                  <h4 class="text-white">Web</h4>
                  <p class="mb-2">decorayvive.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container-fluid copyright py-4">
        <div class="container">
          <div class="row g-4 align-items-center">
            <div class="col-md-6 text-center text-md-start mb-md-0">
              <span class="text-white">
                <i class="fas fa-copyright text-light me-2"></i>Mueblería Decora y Vive, Todos los derechos reservados.
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
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