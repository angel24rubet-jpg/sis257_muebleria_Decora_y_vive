import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import CategoriasView from "../views/CategoriasView.vue";
import ColoresView from "../views/ColoresView.vue";
import ProductosView from "../views/ProductosView.vue";
import ClientesView from "../views/ClientesView.vue";
import VentasView from "../views/VentasView.vue";
import ReportesView from "../views/ReportesView.vue";
import PedidosView from "../views/PedidosView.vue";

import LoginView from "../views/LoginView.vue";
import RegistroView from "../views/RegistroView.vue";

import TiendaView from "../views/TiendaView.vue";
import CarritoView from "../views/CarritoView.vue";
import CheckoutView from "../views/CheckoutView.vue";

import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    // MODULOS ADMINISTRATIVOS
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { rol: "ADMINISTRADOR" },
    },
    {
      path: "/categorias",
      name: "categorias",
      component: CategoriasView,
      meta: { rol: "ADMINISTRADOR" },
    },
    {
      path: "/colores",
      name: "colores",
      component: ColoresView,
      meta: { rol: "ADMINISTRADOR" },
    },
    {
      path: "/productos",
      name: "productos",
      component: ProductosView,
      meta: { rol: "ADMINISTRADOR" },
    },
    {
      path: "/clientes",
      name: "clientes",
      component: ClientesView,
      meta: { rol: "ADMINISTRADOR" },
    },
    {
      path: "/ventas",
      name: "ventas",
      component: VentasView,
      meta: { rol: "ADMINISTRADOR" },
    },
    {
      path: "/reportes",
      name: "reportes",
      component: ReportesView,
      meta: { rol: "ADMINISTRADOR" },
    },
    {
      path: "/pedidos",
      name: "pedidos",
      component: PedidosView,
      meta: { rol: "ADMINISTRADOR" },
    },

    // TIENDA Y CARRITO
    {
      path: "/tienda",
      name: "tienda",
      component: TiendaView,
    },
    {
      path: "/carrito",
      name: "carrito",
      component: CarritoView,
    },

    // FINALIZAR COMPRA: SOLO CLIENTES
    {
      path: "/checkout",
      name: "checkout",
      component: CheckoutView,
      meta: { rol: "CLIENTE" },
    },

    // AUTENTICACION
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

    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/CheckoutView.vue'),
    },
    {
      path: '/producto/:id?',
      name: 'single-product',
      component: () => import('@/views/SingleView.vue'),
    },
    {
      path: '/bestseller',
      name: 'bestseller',
      component: () => import('@/views/BestsellerView.vue'),
    },
  ],
});

// CONTROL DE ACCESO
router.beforeEach((to) => {
  const auth = useAuthStore();

  const rolRequerido = to.meta.rol as "ADMINISTRADOR" | "CLIENTE" | undefined;

  // Verificar autenticacion y rol
  if (rolRequerido) {
    if (!auth.autenticado) {
      return { name: "login" };
    }

    if (auth.usuario?.rol !== rolRequerido) {
      if (auth.usuario?.rol === "ADMINISTRADOR") {
        return { name: "home" };
      }

      return { name: "tienda" };
    }
  }

  // Evitar volver al login si ya inicio sesion
  if ((to.name === "login" || to.name === "registro") && auth.autenticado) {
    return auth.usuario?.rol === "ADMINISTRADOR"
      ? { name: "home" }
      : { name: "tienda" };
  }

  return true;
});

export default router;
