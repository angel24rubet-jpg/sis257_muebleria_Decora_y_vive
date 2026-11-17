<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    
    <!-- ========================================== -->
    <!-- 1. ENCABEZADO Y TOPBAR                     -->
    <!-- ========================================== -->
    <header>
      <!-- Topbar Superior (Contacto & Info) -->
      <div class="container-fluid px-5 d-none border-bottom d-lg-block">
        <div class="row gx-0 align-items-center">
          <div class="col-lg-4 text-center text-lg-start mb-lg-0">
            <div class="d-inline-flex align-items-center" style="height: 45px;">
              <RouterLink to="/" class="text-muted me-2">Nosotros</RouterLink><small> / </small>
              <RouterLink to="/" class="text-muted mx-2">Soporte</RouterLink><small> / </small>
              <RouterLink to="/" class="text-muted ms-2">Contacto</RouterLink>
            </div>
          </div>
          <div class="col-lg-4 text-center d-flex align-items-center justify-content-center">
            <small class="text-dark me-1">Teléfono:</small>
            <a href="tel:+59177126603" class="text-muted">+591 77126603</a>
          </div>
          <div class="col-lg-4 text-center text-lg-end">
            <div class="d-inline-flex align-items-center" style="height: 45px;">
              <!-- Redirección al Login -->
              <RouterLink to="/login" class="text-muted ms-2">
                <i class="fa fa-user me-2"></i> Mi Cuenta / Acceso
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Barra Intermedia con Marca, Buscador y Carrito -->
      <div class="container-fluid px-5 py-4 d-none d-lg-block">
        <div class="row gx-0 align-items-center text-center">
          
          <!-- LOGO (Le dimos col-lg-4 para más espacio y cambiamos a h2) -->
          <div class="col-md-4 col-lg-4 text-center text-lg-start">
            <RouterLink to="/" class="navbar-brand p-0">
              <h1 class="h2 text-primary m-0 fw-bold">
                <i class="fas fa-couch text-secondary me-2"></i>Decora y Vive
              </h1>
            </RouterLink>
          </div>
          
          <!-- BUSCADOR (Redujimos a col-lg-5) -->
          <div class="col-md-4 col-lg-5 text-center">
            <div class="position-relative ps-4">
              <div class="d-flex border rounded-pill">
                <input class="form-control border-0 rounded-pill w-100 py-3" type="text" placeholder="¿Qué mueble buscas?" />
                <button type="button" class="btn btn-primary rounded-pill py-3 px-5" style="border: 0;">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
          
          <!-- CARRITO (Redirección a /compras) -->
          <div class="col-md-4 col-lg-3 text-center text-lg-end">
            <div class="d-inline-flex align-items-center">
              <RouterLink to="/compras" class="text-muted d-flex align-items-center justify-content-center text-decoration-none">
                <span class="rounded-circle btn-md-square border"><i class="fas fa-shopping-cart"></i></span>
                <span class="text-dark ms-2 fw-bold">Carrito</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Barra de Navegación Principal (Navbar) -->
      <div class="container-fluid nav-bar p-0">
        <div class="row gx-0 bg-primary px-5 align-items-center">
          <div class="col-12">
            <nav class="navbar navbar-expand-lg navbar-light bg-primary">
              <RouterLink to="/" class="navbar-brand d-block d-lg-none">
                <h1 class="h3 text-white m-0">Decora y Vive</h1>
              </RouterLink>
              <button class="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span class="fa fa-bars fa-1x text-white"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarCollapse">
                
                <!-- ENLACES DEL MENÚ PRINCIPAL -->
                <div class="navbar-nav me-auto py-0">
                  <RouterLink to="/" class="nav-item nav-link" active-class="active">Inicio</RouterLink>
                  <RouterLink to="/productos" class="nav-item nav-link" active-class="active">Productos</RouterLink>
                  <RouterLink to="/categorias" class="nav-item nav-link" active-class="active">Categorías</RouterLink>
                </div>
                
                <a href="tel:+59177126603" class="btn btn-secondary rounded-pill py-2 px-4">
                  <i class="fa fa-phone-alt me-2"></i> +591 77126603
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>

    <!-- ========================================== -->
    <!-- 2. VISTA DINÁMICA DE VUE (RouterView)      -->
    <!-- ========================================== -->
    <main class="flex-grow-1">
      <RouterView />
    </main>

    <!-- ========================================== -->
    <!-- 3. FOOTER GLOBAL                           -->
    <!-- ========================================== -->
    <footer class="container-fluid footer py-5 bg-dark text-white-50 mt-auto">
      <div class="container py-5">
        <div class="row g-4 rounded mb-5 p-4" style="background: rgba(255, 255, 255, .03);">
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
          <small>&copy; 2026 Mueblería Decora y Vive. Todos los derechos reservados.</small>
        </div>
      </div>
    </footer>
    
  </div>
</template>

<style>
/* Rompemos el límite por defecto de Vue para que la plantilla ocupe toda la pantalla */
#app {
  max-width: 100% !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow-x: hidden;
}
</style>