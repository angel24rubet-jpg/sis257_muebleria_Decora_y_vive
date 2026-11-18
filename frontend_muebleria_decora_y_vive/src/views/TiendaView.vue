<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { listarProductos } from "@/services/productoService";
import { useCarritoStore } from "@/stores/carrito";

const carrito = useCarritoStore();

const productos = ref<any[]>([]);
const cargando = ref(true);
const error = ref("");
const coloresSeleccionados = ref<Record<number, number>>({});

onMounted(async () => {
  try {
    productos.value = await listarProductos();
  } catch {
    error.value = "No se pudieron cargar los productos.";
  } finally {
    cargando.value = false;
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

function desplazarCatalogo() {
  document.getElementById("catalogo")?.scrollIntoView({
    behavior: "smooth",
  });
}
</script>

<template>
  <div class="tienda-premium">
    <!-- BANNER PRINCIPAL -->
    <section class="hero">
      <div class="hero-contenido">
        <span class="subtitulo">DISEÑO · CONFORT · ELEGANCIA</span>

        <h1>Tu hogar merece<br />algo extraordinario</h1>

        <p>
          Descubre muebles diseñados para transformar tus espacios en lugares
          únicos y especiales.
        </p>

        <button @click="desplazarCatalogo" class="btn btn-hero">
          EXPLORAR COLECCIÓN
          <i class="pi pi-arrow-right"></i>
        </button>
      </div>

      <div class="hero-decoracion">
        <div class="hero-circulo"></div>
        <i class="pi pi-home"></i>
        <span>DECORA Y VIVE</span>
      </div>
    </section>

    <!-- BENEFICIOS -->
    <section class="beneficios container-fluid">
      <div class="row g-3">
        <div class="col-12 col-md-4">
          <div class="beneficio-item">
            <i class="pi pi-star"></i>
            <span>Diseño y calidad</span>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="beneficio-item">
            <i class="pi pi-truck"></i>
            <span>Atención personalizada</span>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="beneficio-item">
            <i class="pi pi-shield"></i>
            <span>Compra segura</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CATALOGO -->
    <section id="catalogo" class="catalogo-seccion container">
      <div class="catalogo-encabezado row align-items-end">
        <div class="col-12 col-lg">
          <span class="subtitulo">NUESTRA SELECCIÓN</span>
          <h2>Muebles para cada espacio</h2>
          <p>Encuentra ese detalle que hace especial tu hogar.</p>
        </div>

        <div class="col-12 col-lg-auto">
          <RouterLink to="/carrito" class="btn btn-carrito">
            <i class="pi pi-shopping-bag"></i>
            Mi carrito ({{ carrito.cantidadProductos }})
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
          v-for="producto in productos"
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

.hero {
  min-height: 480px;
  margin: 28px auto 0;
  width: 94%;
  background:
    linear-gradient(90deg, rgba(35, 27, 21, 0.75), rgba(35, 27, 21, 0.15)),
    url("/images/banner-principal.jfif") center 55% / cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 65px 9%;
  overflow: hidden;
  position: relative;
}

.hero-contenido {
  max-width: 570px;
  position: relative;
  z-index: 2;
}

.subtitulo {
  color: #f0d5ae;
  font-size: 11px;
  letter-spacing: 3px;
  font-weight: 700;
}

.hero h1 {
  font-family: "Playfair Display", serif;
  font-size: clamp(40px, 5vw, 65px);
  line-height: 1.12;
  margin: 20px 0;
  color: #fff;
}

.hero p {
  color: #f5eee6;
  line-height: 1.9;
  max-width: 450px;
  font-size: 14px;
}

.btn-hero {
  margin-top: 22px;
  padding: 15px 25px;
  background: #49382e;
  color: white;
  border: none;
  border-radius: 0;
  letter-spacing: 1px;
  font-size: 11px;
}

.btn-hero:hover {
  background: #a17e55;
  color: white;
}

.btn-hero i {
  margin-left: 12px;
}

.hero-decoracion {
  width: 310px;
  height: 310px;
  border-radius: 50%;
  background: #dfd0bd;
  display: none;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #80684e;
  margin-right: 4%;
  position: relative;
}

.hero-decoracion i {
  font-size: 85px;
}

.hero-decoracion span {
  letter-spacing: 4px;
  font-size: 12px;
  margin-top: 20px;
}

.beneficios {
  width: 88%;
  margin: 40px auto 70px;
}

.beneficio-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #625448;
  font-size: 13px;
  padding: 12px;
}

.beneficio-item i {
  color: #a17e55;
  font-size: 22px;
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
  font-size: 36px;
  font-weight: 600;
  margin: 10px 0;
  color: #49382e;
}

.catalogo-encabezado p {
  color: #8c8074;
  font-size: 13px;
}

.btn-carrito {
  padding: 12px 18px;
  background: #49382e;
  color: white;
  text-decoration: none;
  font-size: 12px;
  white-space: nowrap;
  border-radius: 0;
}

.btn-carrito:hover {
  background: #a17e55;
  color: white;
}

.btn-carrito i {
  margin-right: 8px;
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

.producto-imagen {
  height: 250px;
  background: #f0ece6;
  position: relative;
  overflow: hidden;
}

.producto-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  top: 14px;
  left: 14px;
  background: #fff;
  padding: 7px 10px;
  font-size: 9px;
  letter-spacing: 1px;
  color: #80684e;
}

.producto-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.producto-info h3 {
  font-family: "Playfair Display", serif;
  font-size: 21px;
  margin: 0;
  color: #49382e;
}

.descripcion {
  color: #918579;
  font-size: 12px;
  min-height: 30px;
  margin: 0;
}

.precio {
  font-size: 19px;
  color: #9b754d;
  font-weight: 700;
}

.producto-info label {
  font-size: 12px;
  color: #75685c;
}

.producto-info .form-select {
  padding: 12px;
  border: 1px solid #e3dcd2;
  background-color: #faf8f4;
  color: #49382e;
  font-size: 13px;
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
  font-size: 12px;
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
  font-size: 13px;
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
}

.btn-banner:hover {
  background: #a17e55;
  color: white;
}

@media (max-width: 700px) {
  .hero {
    min-height: 390px;
    padding: 45px 8%;
  }

  .beneficios {
    margin: 35px auto 50px;
  }

  .catalogo-encabezado h2 {
    font-size: 29px;
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

/* FOTOGRAFIAS */
.producto-imagen {
  height: 220px;
  width: 100%;
}

.producto-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
</style>
