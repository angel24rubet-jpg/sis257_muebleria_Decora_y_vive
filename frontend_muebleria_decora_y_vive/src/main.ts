import { createApp } from "vue";
import { createPinia } from "pinia";

// PrimeVue
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import "primeicons/primeicons.css";
// COMENTAMOS PRIMEFLEX: Causa conflictos con el sistema de grillas de Bootstrap de la plantilla Electro
// import "primeflex/primeflex.css"; 

// Componentes principales
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

// Configuracion de Pinia
app.use(createPinia());

// Configuracion de Vue Router
app.use(router);

// Configuracion de PrimeVue
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
        cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities'
        }
    }
  },
});

// Montar la aplicacion
app.mount("#app");