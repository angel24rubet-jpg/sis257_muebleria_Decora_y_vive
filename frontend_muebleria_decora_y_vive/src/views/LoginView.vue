<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

const formulario = ref({
  usuario: "",
  password: "",
});

const error = ref("");
const cargando = ref(false);

async function iniciarSesion() {
  error.value = "";
  cargando.value = true;

  try {
    await auth.login(formulario.value);

    if (auth.usuario?.rol === "ADMINISTRADOR") {
      router.push("/");
    } else {
      router.push("/tienda");
    }
  } catch (e: any) {
    error.value =
      e.response?.data?.message || "Usuario o contraseña incorrectos";
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <div class="login">
    <h1>Bienvenido</h1>
    <p>Mueblería Decora y Vive</p>

    <form @submit.prevent="iniciarSesion">
      <input
        v-model="formulario.usuario"
        placeholder="Usuario o correo electrónico"
        required
      />

      <input
        v-model="formulario.password"
        type="password"
        placeholder="Contraseña"
        required
      />

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit" :disabled="cargando">
        {{ cargando ? "Ingresando..." : "Iniciar sesión" }}
      </button>
    </form>

    <p>
      ¿No tienes cuenta?
      <RouterLink to="/registro">Regístrate aquí</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.login {
  max-width: 420px;
  margin: 50px auto;
  padding: 30px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 4px 20px #00000012;
}

h1,
.login > p {
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
