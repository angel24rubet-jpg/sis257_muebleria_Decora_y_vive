import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import CategoriasView from "../views/CategoriasView.vue";
import ColoresView from "../views/ColoresView.vue";
import ProductosView from "../views/ProductosView.vue";
import ClientesView from "../views/ClientesView.vue";
import VentasView from "../views/VentasView.vue";
import ReportesView from "../views/ReportesView.vue";

import LoginView from "../views/LoginView.vue";
import RegistroView from "../views/RegistroView.vue";

import { useAuthStore } from "@/stores/auth";

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
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/registro",
      name: "registro",
      component: RegistroView,
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  const rutasAdmin = [
    "/",
    "/categorias",
    "/colores",
    "/productos",
    "/clientes",
    "/ventas",
    "/reportes",
  ];

  if (rutasAdmin.includes(to.path)) {
    if (!auth.autenticado) {
      return "/login";
    }

    if (auth.usuario?.rol !== "ADMINISTRADOR") {
      return "/tienda";
    }
  }

  if ((to.path === "/login" || to.path === "/registro") && auth.autenticado) {
    return auth.usuario?.rol === "ADMINISTRADOR" ? "/" : "/tienda";
  }
});

export default router;
