<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { RouterLink } from "vue-router";
import { listarProductos } from "@/services/productoService";
import { listarCategorias } from "@/services/categoriaService";
import { useCarritoStore } from "@/stores/carrito";

const carrito = useCarritoStore();

const productos = ref<any[]>([]);

// Categorias disponibles
const categorias = ref<any[]>([]);

// Categoria seleccionada
const categoriaSeleccionada = ref<number | "todas">("todas");

// Productos filtrados por categoria
const productosFiltrados = computed(() => {
  if (categoriaSeleccionada.value === "todas") {
    return productos.value;
  }

  return productos.value.filter(
    (producto) =>
      producto.categoria?.id_categoria === categoriaSeleccionada.value,
  );
});

const cargando = ref(true);
const error = ref("");
const coloresSeleccionados = ref<Record<number, number>>({});

onMounted(async () => {
  // Cargar productos
  try {
    productos.value = await listarProductos();
  } catch {
    error.value = "No se pudieron cargar los productos.";
  } finally {
    cargando.value = false;
  }

  // Cargar categorias activas
  try {
    const respuesta = await listarCategorias();

    categorias.value = respuesta.filter(
      (categoria: any) => categoria.estado === true,
    );
  } catch (err) {
    console.error("Error al cargar categorias:", err);
  }
});

function agregarAlCarrito(producto: any) {
  const idColor = coloresSeleccionados.value[producto.id_producto];

  const variante = producto.colores?.find(
    (item: any) => item.id_producto_color === idColor,
  );

  if (!variante) {
    alert("Selecciona un color disponible.");
    return;
  }

  if (!variante.color?.estado || variante.stock <= 0) {
    alert("Este color no tiene existencias disponibles.");
    return;
  }

  carrito.agregar({
    id_producto_color: variante.id_producto_color,
    id_producto: producto.id_producto,
    nombre: producto.nombre,
    fotografia: producto.fotografia || "",
    precio: Number(producto.precio),
    color: variante.color.nombre,
    cantidad: 1,
    stock: variante.stock,
  });
}

// Imagenes del carrusel
const diapositivas = [
  "/images/banner-principal.jfif",
  "/images/sala.png",
  "/images/comedor.png",
  "/images/dormitorio.png",
  "/images/oficina.png",
];

// Imagen que se muestra actualmente
const diapositivaActual = ref(0);

// Cambiar a la siguiente imagen
function siguienteDiapositiva() {
  diapositivaActual.value = (diapositivaActual.value + 1) % diapositivas.length;
}

// Cambiar a la imagen anterior
function anteriorDiapositiva() {
  diapositivaActual.value =
    (diapositivaActual.value - 1 + diapositivas.length) % diapositivas.length;
}

// Temporizador del carrusel
let intervaloCarrusel: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  intervaloCarrusel = setInterval(siguienteDiapositiva, 5000);
});

onUnmounted(() => {
  if (intervaloCarrusel) {
    clearInterval(intervaloCarrusel);
  }
});

function desplazarCatalogo() {
  document.getElementById("catalogo")?.scrollIntoView({
    behavior: "smooth",
  });
}
</script>

<template>
  <div class="tienda-premium">
    <!-- BANNER PRINCIPAL -->

    <!-- CARRUSEL PRINCIPAL -->
    <section class="hero-carrusel">
      <!-- Imagen de fondo -->
      <div class="hero-fondo">
        <Transition name="carrusel-fade" mode="out-in">
          <img
            :key="diapositivaActual"
            :src="diapositivas[diapositivaActual]"
            alt="Muebles Decora y Vive"
          />
        </Transition>
      </div>

      <!-- Contenido encima de la imagen -->
      <div class="hero-contenido">
        <span class="subtitulo">DISEÑO · CONFORT · ELEGANCIA</span>

        <h1>Tu hogar merece algo extraordinario</h1>

        <p>
          Descubre muebles diseñados para transformar tus espacios en lugares
          únicos y especiales.
        </p>

        <button @click="desplazarCatalogo" class="btn btn-hero">
          EXPLORAR COLECCIÓN
          <i class="pi pi-arrow-right"></i>
        </button>
      </div>

      <!-- Flecha anterior -->
      <button
        type="button"
        class="carrusel-flecha anterior"
        @click="anteriorDiapositiva"
        aria-label="Imagen anterior"
      >
        <i class="pi pi-chevron-left"></i>
      </button>

      <!-- Flecha siguiente -->
      <button
        type="button"
        class="carrusel-flecha siguiente"
        @click="siguienteDiapositiva"
        aria-label="Imagen siguiente"
      >
        <i class="pi pi-chevron-right"></i>
      </button>

      <!-- Indicadores -->
      <div class="carrusel-indicadores">
        <button
          v-for="(imagen, indice) in diapositivas"
          :key="indice"
          type="button"
          :class="{ activa: diapositivaActual === indice }"
          @click="diapositivaActual = indice"
          :aria-label="'Mostrar imagen ' + (indice + 1)"
        ></button>
      </div>
    </section>

    <!-- BENEFICIOS: distribuidos horizontalmente debajo del banner -->
    <section class="beneficios">
      <div class="beneficios-contenedor">
        <div class="beneficio-item">
          <div class="beneficio-icono">
            <i class="pi pi-star"></i>
          </div>
          <div class="beneficio-texto">
            <h3>Diseño y calidad</h3>
            <p>Muebles seleccionados para tu hogar</p>
          </div>
        </div>

        <div class="beneficio-item">
          <div class="beneficio-icono">
            <i class="pi pi-truck"></i>
          </div>
          <div class="beneficio-texto">
            <h3>Atención personalizada</h3>
            <p>Te acompañamos en tu elección</p>
          </div>
        </div>

        <div class="beneficio-item">
          <div class="beneficio-icono">
            <i class="pi pi-shield"></i>
          </div>
          <div class="beneficio-texto">
            <h3>Compra segura</h3>
            <p>Compra con confianza y tranquilidad</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CATALOGO -->
    <section id="catalogo" class="catalogo-seccion container">
      <div class="catalogo-encabezado row align-items-end">
        <!-- FILTRO DE CATEGORIAS -->
        <div class="categorias-filtro">
          <button
            type="button"
            class="categoria-btn"
            :class="{ activa: categoriaSeleccionada === 'todas' }"
            @click="categoriaSeleccionada = 'todas'"
          >
            Todas
          </button>

          <button
            v-for="categoria in categorias"
            :key="categoria.id_categoria"
            type="button"
            class="categoria-btn"
            :class="{
              activa: categoriaSeleccionada === categoria.id_categoria,
            }"
            @click="categoriaSeleccionada = categoria.id_categoria"
          >
            {{ categoria.nombre }}
          </button>
        </div>

        <div class="col-12 col-lg">
          <span class="subtitulo">NUESTRA SELECCIÓN</span>
          <h2>Muebles para cada espacio</h2>
          <p>Encuentra ese detalle que hace especial tu hogar.</p>
        </div>

        <div class="col-12 col-lg-auto">
          <RouterLink to="/carrito" class="btn-carrito">
            <i class="pi pi-shopping-cart"></i>

            <span class="carrito-texto">
              <strong>MI CARRITO</strong>
              <small>Tus muebles favoritos</small>
            </span>

            <span class="contador-carrito">
              {{ carrito.cantidadProductos }}
            </span>

            <i class="pi pi-arrow-right carrito-flecha"></i>
          </RouterLink>
        </div>
      </div>

      <div v-if="cargando" class="estado">
        <div class="spinner-border spinner-cafe" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando nuestra colección...</p>
      </div>

      <div v-else-if="error" class="estado error">
        {{ error }}
      </div>

      <div v-else-if="productos.length === 0" class="estado">
        Próximamente tendremos productos disponibles.
      </div>

      <div v-else class="row g-4">
        <div
          v-for="producto in productosFiltrados"
          :key="producto.id_producto"
          class="col-12 col-sm-6 col-lg-4 col-xl-3"
        >
          <article class="producto-card card h-100">
            <div class="producto-imagen">
              <img
                v-if="producto.fotografia"
                :src="producto.fotografia"
                :alt="producto.nombre"
              />

              <div v-else class="imagen-pendiente">
                <i class="pi pi-image"></i>
                <span>Fotografía próximamente</span>
              </div>

              <span class="etiqueta-producto">DECORA Y VIVE</span>
            </div>

            <div class="producto-info card-body">
              <h3>{{ producto.nombre }}</h3>

              <p class="descripcion">
                {{ producto.descripcion }}
              </p>

              <div class="precio">
                Bs {{ Number(producto.precio).toFixed(2) }}
              </div>

              <label :for="'color-' + producto.id_producto">
                Selecciona un color
              </label>

              <select
                class="form-select"
                :id="'color-' + producto.id_producto"
                v-model="coloresSeleccionados[producto.id_producto]"
              >
                <option disabled :value="undefined">Seleccionar color</option>

                <option
                  v-for="variante in producto.colores?.filter(
                    (item: any) => item.color?.estado,
                  ) || []"
                  :key="variante.id_producto_color"
                  :value="variante.id_producto_color"
                  :disabled="variante.stock <= 0"
                >
                  {{ variante.color.nombre }} - Stock: {{ variante.stock }}
                </option>
              </select>

              <button
                class="btn btn-agregar w-100"
                @click="agregarAlCarrito(producto)"
                :disabled="
                  !producto.colores?.some(
                    (item: any) => item.color?.estado && item.stock > 0,
                  )
                "
              >
                <i class="pi pi-shopping-bag"></i>
                Agregar al carrito
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- BANNER INFERIOR -->
    <section class="banner-inferior container-fluid">
      <span>DECORA TU ESPACIO</span>
      <h2>Los detalles crean hogares únicos.</h2>
      <p>Encuentra inspiración para cada rincón de tu casa.</p>
      <button class="btn btn-banner" @click="desplazarCatalogo">
        DESCUBRIR PRODUCTOS
      </button>
    </section>
  </div>
</template>

<style scoped>
.tienda-premium {
  background: #faf8f4;
  color: #40362e;
  padding-bottom: 50px;
}

/* CARRUSEL PRINCIPAL */
.hero-carrusel {
  width: 94%;
  height: 480px;
  min-height: 480px;
  margin: 28px auto 0;
  padding: 0;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: #49382e;
}

.hero-fondo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hero-fondo::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    90deg,
    rgba(35, 27, 21, 0.78) 0%,
    rgba(35, 27, 21, 0.48) 48%,
    rgba(35, 27, 21, 0.08) 100%
  );
}

.hero-fondo img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Transicion entre imagenes */
.carrusel-fade-enter-active,
.carrusel-fade-leave-active {
  transition: opacity 0.5s ease;
}

.carrusel-fade-enter-from,
.carrusel-fade-leave-to {
  opacity: 0;
}

/* CONTENIDO DEL BANNER */
.hero-contenido {
  width: 650px;
  max-width: 65%;
  padding: 0;
  margin-left: 9%;
  position: relative;
  z-index: 2;
}

/* Titulo original */
.hero-contenido h1 {
  font-family: "Playfair Display", serif;
  font-size: clamp(40px, 5vw, 65px);
  line-height: 1.12;
  font-weight: 600;
  margin: 20px 0;
  color: #ffffff;
  max-width: 650px;
}

/* Descripcion */
.hero-contenido p {
  color: #f5eee6;
  line-height: 1.9;
  max-width: 450px;
  font-size: 16px;
  margin-bottom: 0;
}

/* Boton original */
.btn-hero {
  margin-top: 22px;
  padding: 15px 25px;
  background: #49382e;
  color: #ffffff;
  border: none;
  border-radius: 0;
  letter-spacing: 1px;
  font-size: 14px;
}

.btn-hero:hover {
  background: #a17e55;
  color: #ffffff;
}

.btn-hero i {
  margin-left: 12px;
}

.btn-hero:hover {
  background: #a17e55;
  color: white;
}

.btn-hero i {
  margin-left: 12px;
}

/* Controles del carrusel */
.carrusel-flecha {
  position: absolute;
  z-index: 3;
  top: 50%;
  transform: translateY(-50%);
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 50%;
  background: rgba(73, 56, 46, 0.55);
  color: #fff;
  cursor: pointer;
  transition: all 0.25s ease;
}

.carrusel-flecha:hover {
  background: #d9b98d;
  color: #49382e;
}

.carrusel-flecha.anterior {
  left: 18px;
}

.carrusel-flecha.siguiente {
  right: 18px;
}

.carrusel-indicadores {
  position: absolute;
  z-index: 3;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
}

.carrusel-indicadores button {
  width: 10px;
  height: 10px;
  padding: 0;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carrusel-indicadores button.activa {
  width: 30px;
  background: #d9b98d;
}

/* BENEFICIOS: franja horizontal con iconos */
.beneficios {
  width: 88%;
  margin: 30px auto 65px;
  padding: 22px 15px;
  background: #fffdfa;
  border-top: 1px solid #eee4d8;
  border-bottom: 1px solid #eee4d8;
}

.beneficios-contenedor {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  max-width: 1150px;
  margin: 0 auto;
}

.beneficio-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 12px 18px;
}

.beneficio-icono {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4ede3;
  border-radius: 50%;
  color: #a17e55;
}

.beneficio-icono i {
  font-size: 21px;
}

.beneficio-texto h3 {
  margin: 0 0 5px;
  color: #49382e;
  font-size: 15px;
  font-weight: 700;
}

.beneficio-texto p {
  margin: 0;
  color: #918579;
  font-size: 13px;
  line-height: 1.5;
}

.catalogo-seccion {
  max-width: 1300px;
}

.catalogo-encabezado {
  gap: 20px;
  margin-bottom: 32px;
}

.catalogo-encabezado h2,
.banner-inferior h2 {
  font-family: "Playfair Display", serif;
  font-size: 40px;
  font-weight: 600;
  margin: 10px 0;
  color: #49382e;
}

.catalogo-encabezado p {
  color: #8c8074;
  font-size: 15px;
}

/* Boton del carrito */
.btn-carrito {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  min-width: 230px;
  padding: 13px 18px;
  background-color: #49382e;
  color: #ffffff;
  text-decoration: none;
  border: 1px solid #49382e;
  border-radius: 8px;
  box-shadow: 0 5px 14px rgba(73, 56, 46, 0.14);
  transition: all 0.25s ease;
}

/* Icono del carrito */
.btn-carrito > .pi-shopping-cart {
  font-size: 24px;
  color: #f3d7ac;
}

/* Texto del boton */
.carrito-texto {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.25;
}

.carrito-texto strong {
  font-size: 13px;
  letter-spacing: 1px;
  color: #ffffff;
}

.carrito-texto small {
  font-size: 11px;
  color: #e9d9c5;
  margin-top: 3px;
}

/* Contador de productos */
.contador-carrito {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-left: auto;
  border-radius: 50%;
  background-color: #d9b98d;
  color: #49382e;
  font-size: 12px;
  font-weight: 700;
}

/* Flecha */
.carrito-flecha {
  font-size: 13px;
  color: #f3d7ac;
}

/* Efecto al pasar el mouse */
.btn-carrito:hover {
  background-color: #806044;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 7px 18px rgba(73, 56, 46, 0.22);
}

.btn-carrito:hover .contador-carrito {
  background-color: #ffffff;
}

/* Adaptacion para celulares */
@media (max-width: 700px) {
  /* Boton del carrito */
  .btn-carrito {
    width: 100%;
    justify-content: flex-start;
  }

  /* Carrusel */
  .hero-carrusel {
    height: 430px;
    min-height: 430px;
  }

  /* Texto del banner */
  .hero-contenido {
    width: auto;
    max-width: 75%;
    margin-left: 12%;
    padding: 0;
  }

  .hero-contenido h1 {
    font-size: 34px;
  }

  .hero-contenido p {
    font-size: 14px;
    line-height: 1.7;
  }

  /* Flechas */
  .carrusel-flecha {
    width: 34px;
    height: 34px;
  }

  .carrusel-flecha.anterior {
    left: 8px;
  }

  .carrusel-flecha.siguiente {
    right: 8px;
  }
}

.producto-card {
  background: white;
  border: 1px solid #eee9e1;
  border-radius: 0;
  overflow: hidden;
  transition:
    transform 0.25s,
    box-shadow 0.25s;
}

.producto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px #49382e14;
}

/* Contenedor de fotografias */
.producto-imagen {
  height: 280px;
  background: #ffffff;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

/* Fotografia completa */
.producto-imagen img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  transition: transform 0.3s ease;
}

/* Efecto suave al pasar el mouse */
.producto-card:hover .producto-imagen img {
  transform: scale(1.04);
}

.imagen-pendiente {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #aa9c8d;
  gap: 12px;
  font-size: 12px;
}

.imagen-pendiente i {
  font-size: 40px;
}

.etiqueta-producto {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.92);
  padding: 6px 9px;
  font-size: 10px;
  letter-spacing: 1px;
  color: #80684e;
  z-index: 2;
}

.producto-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.producto-info h3 {
  font-family: "Playfair Display", serif;
  font-size: 23px;
  margin: 0;
  color: #49382e;
}

.descripcion {
  color: #918579;
  font-size: 14px;
  line-height: 1.6;
  min-height: 30px;
  margin: 0;
}

.precio {
  font-size: 22px;
  color: #9b754d;
  font-weight: 700;
}

.producto-info label {
  font-size: 13px;
  color: #75685c;
}

.producto-info .form-select {
  padding: 12px;
  border: 1px solid #e3dcd2;
  background-color: #faf8f4;
  color: #49382e;
  font-size: 14px;
  border-radius: 0;
}

.producto-info .form-select:focus {
  border-color: #a17e55;
  box-shadow: 0 0 0 0.2rem rgba(161, 126, 85, 0.15);
}

.btn-agregar {
  padding: 13px;
  background: #49382e;
  color: white;
  border: none;
  border-radius: 0;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-agregar:hover {
  background: #a17e55;
  color: white;
}

.btn-agregar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-agregar i {
  margin-right: 8px;
}

.spinner-cafe {
  color: #49382e;
}

.estado {
  text-align: center;
  padding: 50px 15px;
  color: #796d61;
}

.error {
  color: #b83232;
}

.banner-inferior {
  margin: 85px auto 0;
  width: 90%;
  padding: 55px 25px;
  text-align: center;
  background: #eee6da;
}

.banner-inferior h2 {
  font-size: 32px;
}

.banner-inferior p {
  color: #75685c;
  font-size: 15px;
}

.btn-banner {
  margin-top: 15px;
  padding: 13px 22px;
  background: #49382e;
  color: white;
  border: none;
  border-radius: 0;
  font-size: 11px;
  letter-spacing: 1px;
  font-size: 13px;
}

.btn-banner:hover {
  background: #a17e55;
  color: white;
}

@media (max-width: 700px) {
  .hero-carrusel {
    height: 430px;
    min-height: 430px;
  }

  .hero-contenido {
    padding: 45px 55px;
  }

  .hero-contenido h1 {
    font-size: 34px;
  }

  .hero-contenido p {
    font-size: 14px;
    line-height: 1.7;
  }

  .carrusel-flecha {
    width: 34px;
    height: 34px;
  }

  .carrusel-flecha.anterior {
    left: 8px;
  }

  .carrusel-flecha.siguiente {
    right: 8px;
  }

  /* En celular, los beneficios se apilan para facilitar la lectura */
  .beneficios {
    width: 92%;
    margin: 25px auto 45px;
    padding: 15px 5px;
  }

  .beneficios-contenedor {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .beneficio-item {
    justify-content: flex-start;
    padding: 10px 15px;
  }

  .catalogo-encabezado h2 {
    font-size: 32px;
  }

  .producto-imagen {
    height: 220px;
  }

  .banner-inferior {
    margin-top: 55px;
  }
}

/* DISTRIBUCION DEL CATALOGO */
.catalogo-seccion > .row.g-4 {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 25px;
  margin: 0;
}

.catalogo-seccion > .row.g-4 > div {
  width: 100%;
  max-width: 100%;
  padding: 0;
}

/* TARJETAS */
.producto-card {
  width: 100%;
  min-width: 0;
  height: 100%;
}

/* FOTOGRAFIAS: mantener las imagenes completas */
.producto-imagen {
  height: 280px;
  width: 100%;
}

.producto-imagen img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

/* TABLETS */
@media (max-width: 991px) {
  .catalogo-seccion > .row.g-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* CELULARES */
@media (max-width: 575px) {
  .catalogo-seccion > .row.g-4 {
    grid-template-columns: 1fr;
  }
}

/* Filtro de categorias */
.categorias-filtro {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin: 25px 0 35px;
}

.categoria-btn {
  padding: 10px 22px;
  border: 1px solid #d8c8b5;
  border-radius: 25px;
  background: #ffffff;
  color: #49382e;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.categoria-btn:hover {
  background: #f0e7dc;
  border-color: #a17e55;
}

.categoria-btn.activa {
  background: #49382e;
  color: #ffffff;
  border-color: #49382e;
}

@media (max-width: 600px) {
  .categorias-filtro {
    justify-content: flex-start;
    gap: 8px;
  }

  .categoria-btn {
    padding: 9px 16px;
    font-size: 13px;
  }
}
/* Mejorar visibilidad del subtitulo del banner */
.hero-contenido .subtitulo {
  color: #f3d7ac !important;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 4px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.8);
}
</style>
