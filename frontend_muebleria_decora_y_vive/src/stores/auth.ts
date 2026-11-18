import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/services/api";

interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  usuario: string;
  correo: string;
  rol: "ADMINISTRADOR" | "CLIENTE";
}

export const useAuthStore = defineStore("auth", () => {
  const usuario = ref<Usuario | null>(
    JSON.parse(localStorage.getItem("usuario") || "null"),
  );

  const token = ref<string | null>(localStorage.getItem("token"));

  const autenticado = ref(!!token.value);

  async function login(datos: { usuario: string; password: string }) {
    const respuesta = await api.post("/auth/login", datos);

    token.value = respuesta.data.access_token;
    usuario.value = respuesta.data.user;
    autenticado.value = true;

    localStorage.setItem("token", token.value!);
    localStorage.setItem("usuario", JSON.stringify(usuario.value));

    return respuesta.data;
  }

  async function registrar(datos: {
    nombre_completo: string;
    usuario: string;
    correo: string;
    password: string;
  }) {
    await api.post("/usuarios", datos);

    return await login({
      usuario: datos.usuario,
      password: datos.password,
    });
  }

  function logout() {
    token.value = null;
    usuario.value = null;
    autenticado.value = false;

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  }

  return {
    usuario,
    token,
    autenticado,
    login,
    logout,
    registrar,
  };
});
