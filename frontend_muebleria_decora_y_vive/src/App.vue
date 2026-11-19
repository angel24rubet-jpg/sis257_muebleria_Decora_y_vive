<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from "vue-router";
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useCarritoStore } from "@/stores/carrito";

const auth = useAuthStore();
const carrito = useCarritoStore();
const router = useRouter();

const esAdministrador = computed(
  () => auth.autenticado && auth.usuario?.rol === "ADMINISTRADOR",
);

const esCliente = computed(
  () => auth.autenticado && auth.usuario?.rol === "CLIENTE",
);

const rutaInicio = computed(() => (esAdministrador.value ? "/" : "/tienda"));

function cerrarSesion() {
  auth.logout();
  router.push("/login");
}
</script>

<template>
  <div class="sitio">
    <div class="topbar" v-if="!esAdministrador">
      <div class="contenedor topbar-contenido">
        <span>Diseño y confort para tu hogar</span>
        <span>Sucre, Bolivia · Atención personalizada</span>
      </div>
    </div>

    <header class="encabezado">
      <div class="contenedor cabecera-principal">
        <RouterLink :to="rutaInicio" class="marca">
          <span class="marca-icono">D</span>
          <span>
            <strong>DECORA Y VIVE</strong>
            <small>MUEBLES & DECORACIÓN</small>
          </span>
        </RouterLink>

        <nav class="navegacion" v-if="!esAdministrador">
          <RouterLink to="/tienda">Inicio</RouterLink>

          <RouterLink v-if="esCliente" to="/mis-pedidos">
            Mis pedidos
          </RouterLink>
        </nav>

        <nav class="navegacion" v-else>
          <RouterLink to="/">Administración</RouterLink>
          <RouterLink to="/productos">Productos</RouterLink>
          <RouterLink to="/pedidos">Pedidos</RouterLink>
        </nav>

        <div class="acciones-cabecera">
          <RouterLink
            v-if="!esAdministrador"
            to="/carrito"
            class="icono-carrito"
            aria-label="Mi carrito"
          >
            <i class="pi pi-shopping-bag"></i>
            <span>{{ carrito.cantidadProductos }}</span>
          </RouterLink>

          <template v-if="auth.autenticado">
            <span class="usuario">
              {{ auth.usuario?.nombre_completo }}
            </span>

            <button class="btn-cuenta" @click="cerrarSesion">Salir</button>
          </template>

          <template v-else>
            <RouterLink to="/login" class="btn-cuenta"> Mi cuenta </RouterLink>
          </template>
        </div>
      </div>
    </header>

    <main class="contenido">
      <RouterView />
    </main>

    <footer class="footer" v-if="!esAdministrador">
      <div class="contenedor footer-contenido">
        <div class="footer-marca">
          <strong>DECORA Y VIVE</strong>
          <p>Transformamos espacios en lugares especiales.</p>
        </div>

        <div>
          <strong>Explora</strong>
          <RouterLink to="/tienda">Inicio</RouterLink>

          <RouterLink v-if="esCliente" to="/mis-pedidos">
            Mis pedidos
          </RouterLink>

          <RouterLink to="/carrito">Mi carrito</RouterLink>
        </div>

        <div>
          <strong>Atención al cliente</strong>
          <a href="tel:+59177126603">+591 77126603</a>
          <span>Sucre, Bolivia</span>
        </div>
      </div>

      <div class="copyright">
        © 2026 Mueblería Decora y Vive. Todos los derechos reservados.
      </div>
    </footer>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap");

:root {
  font-family: "DM Sans", sans-serif;
  color: #302a25;
  background: #faf8f4;
  --cafe: #49382e;
  --dorado: #ad8960;
  --crema: #f5f0e8;
  --texto: #302a25;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  background: #faf8f4;
}

#app {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.sitio {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.contenedor {
  width: min(1240px, 92%);
  margin: auto;
}

.sitio .topbar {
  background-color: #49382e !important;
  color: #f5f0e8;
  font-size: 12px;
  padding: 11px 0;
  letter-spacing: 0.3px;
}

.topbar-contenido {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.encabezado {
  background: #fff;
  border-bottom: 1px solid #eee8df;
  position: relative;
  z-index: 5;
}

.cabecera-principal {
  min-height: 92px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
}

.marca {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--cafe);
  flex-shrink: 0;
}

.marca-icono {
  width: 43px;
  height: 43px;
  border: 1px solid var(--dorado);
  display: grid;
  place-items: center;
  font-family: "Playfair Display", serif;
  font-size: 27px;
  color: var(--dorado);
}

.marca strong,
.footer-marca strong {
  display: block;
  letter-spacing: 2px;
  font-size: 16px;
}

.marca small {
  display: block;
  font-size: 9px;
  letter-spacing: 2.2px;
  margin-top: 5px;
}

.navegacion {
  display: flex;
  align-items: center;
  gap: 28px;
}

.navegacion a {
  color: #554b43;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
}

.navegacion a:hover,
.navegacion a.router-link-active {
  color: var(--dorado);
}

.acciones-cabecera {
  display: flex;
  align-items: center;
  gap: 17px;
}

.icono-carrito {
  position: relative;
  color: var(--cafe);
  font-size: 21px;
  text-decoration: none;
}

.icono-carrito span {
  position: absolute;
  top: -10px;
  right: -12px;
  background: var(--dorado);
  color: white;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  font-size: 10px;
}

.btn-cuenta {
  background: var(--cafe);
  color: white;
  padding: 11px 19px;
  border: 1px solid var(--cafe);
  border-radius: 2px;
  text-decoration: none;
  font-size: 12px;
  cursor: pointer;
}

.btn-cuenta:hover {
  background: var(--dorado);
  border-color: var(--dorado);
  color: white;
}

.usuario {
  font-size: 12px;
  color: var(--cafe);
}

.contenido {
  flex: 1;
}

.footer {
  background: #302820;
  color: #e6ddd1;
  padding-top: 55px;
}

.footer-contenido {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 40px;
}

.footer-contenido > div {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 13px;
}

.footer-contenido strong {
  color: #fff;
  margin-bottom: 5px;
}

.footer-contenido p {
  color: #c2b6a8;
}

.footer-contenido a {
  color: #c2b6a8;
  text-decoration: none;
}

.copyright {
  text-align: center;
  border-top: 1px solid #51463b;
  padding: 18px;
  font-size: 11px;
  color: #c2b6a8;
}

@media (max-width: 850px) {
  .cabecera-principal {
    flex-wrap: wrap;
    padding: 17px 0;
    gap: 18px;
  }

  .navegacion {
    order: 3;
    width: 100%;
    overflow-x: auto;
    gap: 22px;
    padding: 10px 0;
  }

  .acciones-cabecera {
    margin-left: auto;
  }

  .usuario {
    display: none;
  }

  .footer-contenido {
    grid-template-columns: 1fr 1fr;
  }

  .footer-marca {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .topbar-contenido {
    justify-content: center;
  }

  .topbar-contenido span:last-child {
    display: none;
  }

  .marca strong {
    font-size: 13px;
  }

  .footer-contenido {
    grid-template-columns: 1fr;
  }

  .footer-marca {
    grid-column: auto;
  }
}
</style>
