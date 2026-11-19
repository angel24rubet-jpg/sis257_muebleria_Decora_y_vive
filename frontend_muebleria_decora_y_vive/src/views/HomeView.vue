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
  { nombre: "Pedidos", icono: "pi pi-truck", ruta: "/pedidos" },
  { nombre: "Reportes", icono: "pi pi-chart-bar", ruta: "/reportes" },
];

const abrirModulo = (ruta: string) => {
  router.push(ruta);
};
</script>

<template>
  <div class="home-page">
    <!-- BANNER PRINCIPAL -->
    <section class="hero-section">
      <img
        src="/images/sala-principal.jpg"
        alt="Sala moderna Decora y Vive"
        class="hero-background"
      />

      <div class="hero-overlay"></div>

      <div class="hero-content">
        <div class="hero-offer">
          <i class="pi pi-tag"></i>
          HASTA 40% OFF
        </div>

        <h1>
          Elegancia y Confort
          <br />
          para tu Hogar
        </h1>

        <p>
          Descubre nuestra nueva colección de salas y comedores modernos,
          diseñados para transformar tus espacios.
        </p>

        <RouterLink to="/tienda" class="btn-hero">
          Ver Catálogo
          <i class="pi pi-arrow-right"></i>
        </RouterLink>
      </div>

      <div class="hero-indicators">
        <span class="active"></span>
        <span></span>
        <span></span>
      </div>
    </section>

    <!-- BENEFICIOS -->
    <section class="beneficios-section">
      <div class="beneficio-item">
        <div class="beneficio-icon">
          <i class="pi pi-shield"></i>
        </div>
        <div>
          <h6>Garantía Total</h6>
          <small>30 días de satisfacción</small>
        </div>
      </div>

      <div class="beneficio-item">
        <div class="beneficio-icon">
          <i class="pi pi-truck"></i>
        </div>
        <div>
          <h6>Envío Rápido</h6>
          <small>A todo el país</small>
        </div>
      </div>

      <div class="beneficio-item">
        <div class="beneficio-icon">
          <i class="pi pi-headphones"></i>
        </div>
        <div>
          <h6>Atención 24/7</h6>
          <small>Soporte personalizado</small>
        </div>
      </div>

      <div class="beneficio-item">
        <div class="beneficio-icon">
          <i class="pi pi-credit-card"></i>
        </div>
        <div>
          <h6>Pago Seguro</h6>
          <small>Transacciones protegidas</small>
        </div>
      </div>
    </section>

    <!-- PANEL ADMINISTRATIVO -->
    <main
      v-if="auth.autenticado && auth.usuario?.rol === 'ADMINISTRADOR'"
      class="admin-section"
      id="modulos-admin"
    >
      <div class="admin-heading">
        <div class="heading-decoration"></div>
        <span>GESTIÓN DEL NEGOCIO</span>
        <div class="heading-decoration"></div>

        <h2>Panel de Administración</h2>

        <p>
          Administra y controla los diferentes módulos de Mueblería Decora y
          Vive.
        </p>
      </div>

      <div class="modulos-grid">
        <button
          v-for="modulo in modulos"
          :key="modulo.ruta"
          class="modulo-card"
          @click="abrirModulo(modulo.ruta)"
        >
          <div class="modulo-icono">
            <i :class="modulo.icono"></i>
          </div>

          <span>{{ modulo.nombre }}</span>

          <div class="modulo-flecha">
            <i class="pi pi-arrow-right"></i>
          </div>

          <div class="modulo-linea"></div>
        </button>
      </div>
    </main>

    <!-- ACCESO PARA CLIENTES -->
    <section
      v-else-if="auth.autenticado && auth.usuario?.rol === 'CLIENTE'"
      class="cliente-section"
    >
      <div class="cliente-content">
        <span class="cliente-etiqueta">DECORA Y VIVE</span>

        <h2>Bienvenido a tu espacio ideal</h2>

        <p>
          Explora nuestro catálogo y encuentra los muebles ideales para darle un
          nuevo estilo a tu hogar.
        </p>

        <RouterLink to="/tienda" class="btn-hero">
          Ir a la tienda
          <i class="pi pi-arrow-right"></i>
        </RouterLink>
      </div>
    </section>

    <!-- BANNER INFERIOR -->
    <section class="banner-inferior">
      <img
        src="/images/banner-inferior.jpg"
        alt="Comedor moderno Decora y Vive"
        class="banner-inferior-img"
      />

      <div class="banner-inferior-overlay"></div>

      <div class="banner-inferior-content">
        <span>DECORA TU HOGAR</span>

        <h2>
          Estilo, Calidad
          <br />
          y Modernidad
        </h2>

        <p>Muebles que se adaptan a tu estilo de vida.</p>

        <RouterLink to="/productos" class="btn-banner">
          Explorar Productos
          <i class="pi pi-arrow-right"></i>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  width: 100%;
  overflow: hidden;
  background: #f8f4ee;
  color: #49372b;
}

/* BANNER PRINCIPAL */
.hero-section {
  min-height: 460px;
  position: relative;
  display: flex;
  align-items: center;
  background: #e8ded0;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(250, 245, 237, 0.98) 0%,
    rgba(250, 245, 237, 0.91) 30%,
    rgba(250, 245, 237, 0.35) 57%,
    rgba(250, 245, 237, 0.02) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 48%;
  max-width: 570px;
  padding: 55px 0 65px 7%;
}

.hero-offer {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 9px 16px;
  border-radius: 30px;
  background: #f8ead5;
  color: #80532d;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0.7px;
  margin-bottom: 18px;
}

.hero-content h1 {
  color: #573a2b;
  font-family: Georgia, serif;
  font-size: clamp(32px, 4vw, 47px);
  line-height: 1.08;
  font-weight: 700;
  margin-bottom: 18px;
}

.hero-content p {
  color: #66564a;
  font-family: Georgia, serif;
  font-size: 16px;
  line-height: 1.6;
  max-width: 440px;
  margin-bottom: 22px;
}

.btn-hero {
  display: inline-flex;
  align-items: center;
  gap: 17px;
  padding: 14px 25px;
  background: #805b3b;
  color: #fff;
  border-radius: 30px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  transition: 0.25s ease;
}

.btn-hero:hover {
  background: #5d402c;
  color: #fff;
  transform: translateY(-2px);
}

.hero-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  display: flex;
  gap: 12px;
  z-index: 3;
}

.hero-indicators span {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid rgba(128, 91, 59, 0.3);
}

.hero-indicators .active {
  background: #805b3b;
}

/* BENEFICIOS */
.beneficios-section {
  position: relative;
  z-index: 4;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: -1px 2.5% 0;
  padding: 22px 18px;
  background: #fffdf9;
  border: 1px solid #eee3d5;
  border-radius: 16px;
  box-shadow: 0 7px 20px rgba(74, 52, 34, 0.1);
}

.beneficio-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 4px 12px;
  border-right: 1px solid #eadfd2;
}

.beneficio-item:last-child {
  border-right: none;
}

.beneficio-icon {
  flex-shrink: 0;
  width: 49px;
  height: 49px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #f9eddb;
  color: #80532d;
  font-size: 23px;
}

.beneficio-item h6 {
  color: #49372b;
  font-size: 14px;
  font-weight: 750;
  margin-bottom: 5px;
}

.beneficio-item small {
  color: #887b70;
  font-size: 12px;
}

/* PANEL ADMINISTRATIVO */
.admin-section {
  padding: 47px 4% 48px;
  background: #f8f4ee;
}

.admin-heading {
  text-align: center;
  margin-bottom: 28px;
}

.admin-heading > span {
  color: #86572e;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 2px;
}

.admin-heading h2 {
  margin: 12px 0 7px;
  color: #30241d;
  font-family: Georgia, serif;
  font-size: 31px;
  font-weight: 700;
}

.admin-heading p {
  color: #796c61;
  font-family: Georgia, serif;
  font-size: 15px;
  margin-bottom: 0;
}

.heading-decoration {
  display: inline-block;
  width: 38px;
  height: 2px;
  margin: 0 18px 4px;
  background: #c18a3d;
}

.modulos-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 17px;
  max-width: 1250px;
  margin: 0 auto;
}

.modulo-card {
  position: relative;
  min-height: 108px;
  padding: 17px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  border: 1px solid #eee3d5;
  border-radius: 15px;
  background: #fffdf9;
  color: #49372b;
  box-shadow: 0 5px 13px rgba(74, 52, 34, 0.07);
  cursor: pointer;
  transition: all 0.25s ease;
}

.modulo-card:hover {
  transform: translateY(-4px);
  border-color: #c99b60;
  box-shadow: 0 10px 22px rgba(74, 52, 34, 0.13);
}

.modulo-icono {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: #faedd9;
  color: #80532d;
  font-size: 25px;
  transition: 0.25s ease;
}

.modulo-card:hover .modulo-icono {
  background: #805b3b;
  color: #fff;
}

.modulo-card > span {
  font-size: 15px;
  font-weight: 750;
}

.modulo-flecha {
  position: absolute;
  right: 15px;
  bottom: 14px;
  width: 31px;
  height: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #faedd9;
  color: #80532d;
  font-size: 13px;
  transition: 0.25s ease;
}

.modulo-card:hover .modulo-flecha {
  background: #805b3b;
  color: #fff;
}

.modulo-linea {
  position: absolute;
  bottom: 7px;
  left: 19px;
  width: 55px;
  height: 2px;
  background: #c18a3d;
}

/* CLIENTES */
.cliente-section {
  padding: 55px 20px;
  background: #f8f4ee;
  text-align: center;
}

.cliente-content {
  max-width: 650px;
  margin: auto;
}

.cliente-etiqueta {
  color: #a17b45;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 2px;
}

.cliente-content h2 {
  margin: 12px 0;
  color: #49372b;
  font-family: Georgia, serif;
  font-size: 30px;
}

.cliente-content p {
  color: #887b70;
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 23px;
}

/* BANNER INFERIOR */
.banner-inferior {
  position: relative;
  min-height: 255px;
  margin: 12px 2.5% 35px;
  overflow: hidden;
  border-radius: 17px;
  background: #765037;
}

.banner-inferior-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-inferior-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(91, 57, 36, 0.96) 0%,
    rgba(91, 57, 36, 0.87) 38%,
    rgba(91, 57, 36, 0.1) 75%
  );
}

.banner-inferior-content {
  position: relative;
  z-index: 2;
  padding: 32px 5%;
  color: #fff;
}

.banner-inferior-content > span {
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 2px;
}

.banner-inferior-content h2 {
  margin: 12px 0;
  font-family: Georgia, serif;
  font-size: 34px;
  line-height: 1.12;
  font-weight: 700;
}

.banner-inferior-content p {
  font-size: 14px;
  margin-bottom: 17px;
}

.btn-banner {
  display: inline-flex;
  align-items: center;
  gap: 13px;
  padding: 12px 21px;
  border-radius: 30px;
  background: #fff;
  color: #68472e;
  font-size: 13px;
  font-weight: 750;
  text-decoration: none;
  transition: 0.25s ease;
}

.btn-banner:hover {
  background: #f4e5d1;
  color: #49372b;
  transform: translateY(-2px);
}

/* RESPONSIVE */
@media (max-width: 991px) {
  .hero-section {
    min-height: 390px;
  }

  .hero-content {
    width: 58%;
    padding-left: 5%;
  }

  .beneficios-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .beneficio-item:nth-child(2) {
    border-right: none;
  }

  .beneficio-item {
    padding: 10px;
  }

  .modulos-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 575px) {
  .hero-section {
    min-height: 430px;
    align-items: flex-end;
  }

  .hero-background {
    object-position: 65% center;
  }

  .hero-overlay {
    background: linear-gradient(
      0deg,
      rgba(250, 245, 237, 0.98) 0%,
      rgba(250, 245, 237, 0.9) 52%,
      rgba(250, 245, 237, 0.05) 100%
    );
  }

  .hero-content {
    width: 100%;
    padding: 35px 22px 48px;
  }

  .hero-content h1 {
    font-size: 32px;
  }

  .hero-content p {
    font-size: 14px;
  }

  .hero-indicators {
    bottom: 12px;
  }

  .beneficios-section {
    margin: 0 12px;
    padding: 14px 7px;
    gap: 5px;
  }

  .beneficio-item {
    justify-content: flex-start;
    gap: 8px;
    padding: 10px 5px;
    border-right: none;
  }

  .beneficio-icon {
    width: 37px;
    height: 37px;
    font-size: 17px;
    border-radius: 10px;
  }

  .beneficio-item h6 {
    font-size: 10px;
  }

  .beneficio-item small {
    font-size: 9px;
  }

  .admin-section {
    padding: 35px 15px;
  }

  .admin-heading h2 {
    font-size: 24px;
  }

  .admin-heading p {
    font-size: 12px;
  }

  .heading-decoration {
    width: 22px;
    margin: 0 7px 4px;
  }

  .modulos-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 11px;
  }

  .modulo-card {
    min-height: 105px;
    padding: 13px 10px;
    gap: 9px;
  }

  .modulo-icono {
    width: 42px;
    height: 42px;
    font-size: 19px;
  }

  .modulo-card > span {
    font-size: 12px;
  }

  .modulo-flecha {
    width: 24px;
    height: 24px;
    right: 8px;
    bottom: 9px;
    font-size: 10px;
  }

  .modulo-linea {
    left: 11px;
    width: 35px;
  }

  .banner-inferior {
    min-height: 245px;
    margin: 5px 12px 25px;
  }

  .banner-inferior-overlay {
    background: linear-gradient(
      90deg,
      rgba(91, 57, 36, 0.94),
      rgba(91, 57, 36, 0.62)
    );
  }

  .banner-inferior-content {
    padding: 30px 22px;
  }

  .banner-inferior-content h2 {
    font-size: 28px;
  }
}
</style>
