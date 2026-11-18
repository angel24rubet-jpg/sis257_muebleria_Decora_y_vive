<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

const formulario = ref({
  nombre_completo: "",
  usuario: "",
  correo: "",
  password: "",
});

const error = ref("");
const cargando = ref(false);

async function registrar() {
  error.value = "";
  cargando.value = true;

  try {
    await auth.registrar(formulario.value);
    router.push("/tienda");
  } catch (e: any) {
    error.value = e.response?.data?.message || "No se pudo crear la cuenta";
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <div class="registro">
    <h1>Crear una cuenta</h1>
    <p>Bienvenido a Mueblería Decora y Vive</p>

    <form @submit.prevent="registrar">
      <input
        v-model="formulario.nombre_completo"
        placeholder="Nombre completo"
        required
      />

      <input
        v-model="formulario.usuario"
        placeholder="Nombre de usuario"
        required
      />

      <input
        v-model="formulario.correo"
        type="email"
        placeholder="Correo electrónico"
        required
      />

      <input
        v-model="formulario.password"
        type="password"
        placeholder="Contraseña (mínimo 8 caracteres)"
        minlength="8"
        required
      />

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit" :disabled="cargando">
        {{ cargando ? "Registrando..." : "Crear cuenta" }}
      </button>
    </form>

    <p>
      ¿Ya tienes cuenta?
      <RouterLink to="/login">Iniciar sesión</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.registro {
  max-width: 420px;
  margin: 50px auto;
  padding: 30px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 4px 20px #00000012;
}

h1 {
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  padding: 13px;
  background: #7041a6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
}

.error {
  color: red;
}
</style>
