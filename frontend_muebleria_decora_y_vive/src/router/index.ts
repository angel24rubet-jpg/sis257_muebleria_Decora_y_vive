import { createRouter, createWebHistory } from "vue-router";

// Importar las vistas
import HomeView from "../views/HomeView.vue";
import CategoriasView from "../views/CategoriasView.vue";
import ColoresView from "../views/ColoresView.vue";
import ProductosView from "../views/ProductosView.vue";
import ClientesView from "../views/ClientesView.vue";
import VentasView from "../views/VentasView.vue";
import ReportesView from "../views/ReportesView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/categorias",
      name: "categorias",
      component: CategoriasView,
    },
    {
      path: "/colores",
      name: "colores",
      component: ColoresView,
    },
    {
      path: "/productos",
      name: "productos",
      component: ProductosView,
    },
    {
      path: "/clientes",
      name: "clientes",
      component: ClientesView,
    },
    {
      path: "/ventas",
      name: "ventas",
      component: VentasView,
    },
    {
      path: "/reportes",
      name: "reportes",
      component: ReportesView,
    },
  ],
});

export default router;
