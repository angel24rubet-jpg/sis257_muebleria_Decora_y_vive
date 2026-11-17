import { createRouter, createWebHistory } from "vue-router";

// Importar las vistas de los módulos administrativos (Código de tu compañero)
import HomeView from "../views/HomeView.vue";
import CategoriasView from "../views/CategoriasView.vue";
import ColoresView from "../views/ColoresView.vue";
import ProductosView from "../views/ProductosView.vue";
import ClientesView from "../views/ClientesView.vue";
import VentasView from "../views/VentasView.vue";
import ReportesView from "../views/ReportesView.vue";

// Importar las nuevas vistas de la plantilla (y tu Login)
import NosotrosView from "../views/NosotrosView.vue";
import TestimoniosView from "../views/TestimoniosView.vue";
import ContactoView from "../views/ContactoView.vue";
import LoginView from "../views/LoginView.vue"; // El módulo que te toca hacer a ti
import PedidosView from "../views/PedidosView.vue";
import ComprasView from "../views/ComprasView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/categorias", name: "categorias", component: CategoriasView },
    { path: "/colores", name: "colores", component: ColoresView },
    { path: "/productos", name: "productos", component: ProductosView },
    { path: "/clientes", name: "clientes", component: ClientesView },
    { path: "/ventas", name: "ventas", component: VentasView },
    { path: "/reportes", name: "reportes", component: ReportesView },

    // --- NUEVAS RUTAS AGREGADAS ---
    { path: "/nosotros", name: "nosotros", component: NosotrosView },
    { path: "/testimonios", name: "testimonios", component: TestimoniosView },
    { path: "/contacto", name: "contacto", component: ContactoView },
    { path: "/login", name: "login", component: LoginView },
    { path: "/pedidos", name: "pedidos", component: PedidosView },
    { path: "/compras", name: "compras", component: ComprasView },
  ],
});

export default router;