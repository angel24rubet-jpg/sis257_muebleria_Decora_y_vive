<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    
    <!-- BARRA DE NAVEGACIÓN GLOBAL (Inmortal) -->
    <nav class="navbar navbar-expand-lg bg-white shadow-sm px-4 py-3 navbar-custom">
      <div class="container-fluid px-0">
        <RouterLink class="navbar-brand" to="/">
          <span class="d-flex flex-column text-uppercase text-xs fw-bold lh-sm">
            <span class="" style="letter-spacing: .12rem;">Decora y Vive</span>
            <span>Sistema Web</span>
          </span>
        </RouterLink>
      
        <div class="mx-auto d-lg-block d-none">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/">Inicio</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/nosotros">Nosotros</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/productos">Productos</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/testimonios">Testimonios</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/contacto">Contacto</RouterLink>
            </li>
          </ul>
        </div>
        
        <div class="d-flex align-items-center gap-4">
          <span class="d-flex align-items-center gap-2 fw-bold">
            <span><i class="bi bi-telephone"></i></span>
            <span>+591 71234567</span>
          </span>
          <RouterLink class="btn btn-primary btn-sm" to="/compras">
  <i class="bi bi-cart"></i> Carrito
</RouterLink>
        </div>
      </div>
    </nav>

    <!-- EL PIZARRÓN DINÁMICO (Aquí Vue dibuja las páginas que cambian) -->
    <main class="flex-grow-1">
      <RouterView />
    </main>

  </div>
</template>

<style scoped>
/* Los RouterLink a veces se quedan de color azul por defecto. 
   Esto asegura que el texto del logo se mantenga de color oscuro. */
.navbar-brand {
  color: #212529;
  text-decoration: none;
}
</style>