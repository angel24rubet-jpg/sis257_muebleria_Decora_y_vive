<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

// Modulos disponibles del sistema
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

// Navegar al modulo seleccionado
const abrirModulo = (ruta: string) => {
  router.push(ruta);
};
</script>

<template>
  <div>
    <!-- SECCIÓN HERO / SLIDER SOFÁ (PLANTILLA) -->
    <div class="py-lg-8 pt-6">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xxl-8 col-12 ">
            <div class="text-center position-relative">
              <h1 class="fs-1 fst-italic text-secondary">%25 Descuento</h1>
              <h2 class="display-4 lh-1">Elaborado con elegancia</h2>
              
              <!-- Imagen del sofá corregida para Vue -->
              <img src="/images/slider/slider-img-3.png" alt="Sofa" class="img-fluid my-5">
              
              <div class="mt-4">
                <p class="d-none d-lg-block">Experimenta la elegancia de la artesanía atemporal.</p>
                <div class="fw-bold mb-4 d-none d-lg-block">$89</div>
                <a href="#modulos-admin" class="btn btn-dark">Ver Sistema de Gestión</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MENÚ PRINCIPAL (CÓDIGO DE TU COMPAÑERO) -->
    <main class="contenedor" id="modulos-admin">
      <h2 class="mt-5 mb-4 border-bottom pb-2">Módulos Administrativos</h2>

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
    </main>
  </div>
</template>

<style scoped>
.contenedor {
  padding: 30px;
  text-align: center;
  background-color: #f8f9fa; /* Fondo gris claro para separar del área blanca del sofá */
  min-height: 50vh;
}

.modulos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  max-width: 900px;
  margin: 30px auto;
}

.boton-modulo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 30px;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  background: white;
  color: #212529;
  font-size: 16px;
  transition: all 0.3s ease;
}

.boton-modulo:hover {
  background: #212529; /* Hover oscuro estilo plantilla Furnish */
  color: white;
  transform: translateY(-3px);
}

.boton-modulo i {
  font-size: 30px;
}
</style>