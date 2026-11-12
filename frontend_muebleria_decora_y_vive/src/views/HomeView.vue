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
];

// Navegar al modulo seleccionado
const abrirModulo = (ruta: string) => {
  router.push(ruta);
};
</script>

<template>
  <main class="contenedor">
    <h1>Muebleria Decora y Vive</h1>
    <p>Sistema de gestion</p>

    <h2>Menu principal</h2>

    <div class="modulos">
      <button
        v-for="modulo in modulos"
        :key="modulo.ruta"
        class="boton-modulo"
        @click="abrirModulo(modulo.ruta)"
      >
        <i :class="modulo.icono"></i>
        <span>{{ modulo.nombre }}</span>
      </button>
    </div>
  </main>
</template>

<style scoped>
.contenedor {
  padding: 30px;
  text-align: center;
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
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  font-size: 16px;
}

.boton-modulo:hover {
  background: #f0f0f0;
}

.boton-modulo i {
  font-size: 30px;
}
</style>
