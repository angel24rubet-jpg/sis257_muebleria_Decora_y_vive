<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from "vue-router";

// IMPORTACIONES DE SWIPER
import Swiper from 'swiper';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const router = useRouter();

// Lógica de tu compañero
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

// INICIALIZACIÓN REACTIVA DEL CARRUSEL
onMounted(() => {
  new Swiper('#swiper-6', {
    modules: [Navigation, Autoplay, Pagination],
    speed: 800,
    spaceBetween: 100,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      480: { slidesPerView: 1 },
      768: { slidesPerView: 1 },
      1024: { slidesPerView: 1 }
    }
  });
});
</script>

<template>
  <div>
    <!-- ESTRUCTURA HTML DE SWIPER (Sin botones) -->
    <div class="py-lg-8 pt-6">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xxl-8 col-12">
            
            <div class="swiper-container swiper" id="swiper-6">
              <div class="swiper-wrapper">
                
                <!-- Imagen 1 -->
                <div class="swiper-slide px-md-8">
                  <div class="position-relative text-center">
                    <img src="/images/slider/slider-img-2.png" alt="Sofa" class="img-fluid my-5 my-lg-0" />
                    <div class="text-center position-absolute top-0 start-0 px-lg-11">
                      <h1 class="fs-1 fst-italic text-secondary">%20 Descuento</h1>
                      <h2 class="display-4 lh-1">Sofá Comodidad Total</h2>
                    </div>
                  </div>
                </div>

                <!-- Imagen 2 -->
                <div class="swiper-slide px-md-8">
                  <div class="position-relative text-center">
                    <img src="/images/slider/slider-img-1.png" alt="Sofa" class="img-fluid my-5 my-lg-0" />
                    <div class="text-center position-absolute top-0 start-0 px-lg-11">
                      <h1 class="fs-1 fst-italic text-secondary">%10 Descuento</h1>
                      <h2 class="display-4 lh-1">Renueva tu espacio</h2>
                    </div>
                  </div>
                </div>

                <!-- Imagen 3 -->
                <div class="swiper-slide px-md-8">
                  <div class="position-relative text-center">
                    <img src="/images/slider/slider-img-3.png" alt="Sofa" class="img-fluid my-5 my-lg-0" />
                    <div class="text-center position-absolute top-0 start-0 px-lg-11">
                      <h1 class="fs-1 fst-italic text-secondary">%25 Descuento</h1>
                      <h2 class="display-4 lh-1">Elaborado con elegancia</h2>
                    </div>
                  </div>
                </div>

              </div>
              
              <div class="swiper-navigation mb-4">
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
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
  background-color: #f8f9fa;
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
  background: #212529;
  color: white;
  transform: translateY(-3px);
}
.boton-modulo i {
  font-size: 30px;
}
</style>