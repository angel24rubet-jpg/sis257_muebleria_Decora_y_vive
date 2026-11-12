import axios from "axios";

// Configuracion general para conectar con el backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Exportar la instancia para utilizarla en los servicios
export default api;
