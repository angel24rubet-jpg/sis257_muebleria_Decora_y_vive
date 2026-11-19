<script setup lang="ts">
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

const formulario = ref({
  usuario: "",
  password: "",
});

const error = ref("");
const cargando = ref(false);
const mostrarPassword = ref(false);

// Iniciar sesion
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
  <main class="login-pagina">
    <section class="login-contenedor">
      <!-- PANEL IZQUIERDO: FORMULARIO -->
      <div class="login-panel">
        <!-- Decoracion superior -->
        <div class="decoracion decoracion-superior"></div>

        <div class="login-contenido">
          <!-- LOGOTIPO -->
          <div class="marca">
            <div class="marca-simbolo">D</div>

            <h2>DECORA Y VIVE</h2>

            <div class="marca-subtitulo">
              <span></span>
              MUEBLES & DECORACIÓN
              <span></span>
            </div>
          </div>

          <!-- BIENVENIDA -->
          <div class="bienvenida">
            <h1>
              Tu hogar
              <span>comienza aquí</span>
            </h1>

            <div class="linea-dorada"></div>

            <p>
              Accede a tu cuenta y descubre una experiencia única en muebles y
              decoración.
            </p>
          </div>

          <!-- FORMULARIO -->
          <form @submit.prevent="iniciarSesion" class="formulario-login">
            <!-- Usuario -->
            <div class="campo-login">
              <i class="pi pi-user"></i>

              <input
                v-model="formulario.usuario"
                type="text"
                placeholder="Usuario o correo electrónico"
                autocomplete="username"
                required
              />
            </div>

            <!-- Contraseña -->
            <div class="campo-login">
              <i class="pi pi-lock"></i>

              <input
                v-model="formulario.password"
                :type="mostrarPassword ? 'text' : 'password'"
                placeholder="Contraseña"
                autocomplete="current-password"
                required
              />

              <button
                type="button"
                class="btn-mostrar-password"
                @click="mostrarPassword = !mostrarPassword"
                :aria-label="
                  mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                "
              >
                <i
                  :class="mostrarPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                ></i>
              </button>
            </div>

            <!-- Error -->
            <p v-if="error" class="mensaje-error">
              <i class="pi pi-exclamation-circle"></i>
              {{ error }}
            </p>

            <!-- Iniciar sesion -->
            <button type="submit" class="btn-iniciar" :disabled="cargando">
              {{ cargando ? "INGRESANDO..." : "INICIAR SESIÓN" }}
              <i v-if="!cargando" class="pi pi-arrow-right"></i>
            </button>
          </form>

          <!-- REGISTRO -->
          <div class="registro-seccion">
            <div class="separador">
              <span></span>
              <i class="pi pi-home"></i>
              <span></span>
            </div>

            <p>¿Aún no tienes una cuenta?</p>

            <RouterLink to="/registro" class="btn-registro">
              CREAR UNA CUENTA
            </RouterLink>
          </div>
        </div>

        <!-- Decoracion inferior -->
        <div class="decoracion decoracion-inferior"></div>
      </div>

      <!-- PANEL DERECHO: FOTOGRAFIA -->
      <div class="login-imagen">
        <img
          src="/images/login-bg.jfif"
          alt="Ambiente elegante de Decora y Vive"
        />

        <div class="imagen-overlay"></div>

        <div class="imagen-frase">
          <span>DECORA TU ESPACIO</span>
          <h2>Haz de cada rincón un lugar especial.</h2>
          <div class="frase-linea"></div>
          <p>Diseño, comodidad y elegancia para tu hogar.</p>
        </div>
      </div>
    </section>

    <footer class="login-footer">
      © 2026 DECORA Y VIVE · MUEBLES & DECORACIÓN
    </footer>
  </main>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap");

/* PAGINA PRINCIPAL */
.login-pagina {
  min-height: 100vh;
  padding: 24px;
  background: #f6f1e9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Montserrat", sans-serif;
}

/* CONTENEDOR */
.login-contenedor {
  width: 100%;
  max-width: 1350px;
  min-height: 760px;
  display: grid;
  grid-template-columns: 48% 52%;
  background: #fffaf4;
  overflow: hidden;
  box-shadow: 0 15px 45px rgba(73, 56, 46, 0.13);
}

/* PANEL IZQUIERDO */
.login-panel {
  position: relative;
  background: #fffaf4;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 45px 55px;
  overflow: hidden;
}

.login-contenido {
  width: 100%;
  max-width: 490px;
  position: relative;
  z-index: 2;
}

/* MARCA */
.marca {
  text-align: center;
  margin-bottom: 55px;
}

.marca-simbolo {
  width: 66px;
  height: 66px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #a77b42;
  color: #a77b42;
  font-family: "Cormorant Garamond", serif;
  font-size: 46px;
  line-height: 1;
}

.marca h2 {
  color: #49382e;
  font-family: "Cormorant Garamond", serif;
  font-size: 30px;
  font-weight: 600;
  letter-spacing: 5px;
  margin: 0;
}

.marca-subtitulo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
  color: #72543a;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 3px;
}

.marca-subtitulo span {
  width: 35px;
  height: 1px;
  background: #c89b5c;
}

/* BIENVENIDA */
.bienvenida h1 {
  color: #49382e;
  font-family: "Cormorant Garamond", serif;
  font-size: 61px;
  font-weight: 600;
  line-height: 0.95;
  margin: 0;
}

.bienvenida h1 span {
  display: block;
  color: #b7833e;
  font-style: italic;
}

.linea-dorada {
  width: 95px;
  height: 3px;
  margin: 22px 0 15px;
  background: #b7833e;
}

.bienvenida p {
  color: #6b5748;
  font-size: 15px;
  line-height: 1.8;
  margin: 0 0 28px;
  max-width: 440px;
}

/* FORMULARIO */
.formulario-login {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.campo-login {
  height: 57px;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0 17px;
  border: 1px solid #d7c5b3;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.45);
  transition: all 0.25s ease;
}

.campo-login:focus-within {
  border-color: #b7833e;
  box-shadow: 0 0 0 3px rgba(183, 131, 62, 0.1);
}

.campo-login > i {
  color: #76583e;
  font-size: 19px;
}

.campo-login input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #49382e;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
}

.campo-login input::placeholder {
  color: #8c8077;
}

.btn-mostrar-password {
  border: none;
  background: transparent;
  color: #76583e;
  cursor: pointer;
  font-size: 17px;
  padding: 5px;
}

/* MENSAJE DE ERROR */
.mensaje-error {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b23b32;
  font-size: 12px;
  margin: 0;
}

/* BOTON INICIAR SESION */
.btn-iniciar {
  width: 100%;
  min-height: 59px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: #543522;
  color: #ffffff;
  border: 1px solid #543522;
  border-radius: 5px;
  font-family: "Montserrat", sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-iniciar:hover:not(:disabled) {
  background: #a7793e;
  border-color: #a7793e;
}

.btn-iniciar:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* REGISTRO */
.registro-seccion {
  margin-top: 35px;
  text-align: center;
}

.separador {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.separador span {
  flex: 1;
  height: 1px;
  background: #d9c5ad;
}

.separador i {
  color: #b7833e;
  font-size: 20px;
}

.registro-seccion p {
  color: #634a38;
  font-size: 14px;
  margin-bottom: 15px;
}

.btn-registro {
  width: 75%;
  min-height: 49px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #b7833e;
  color: #63452d;
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  transition: all 0.3s ease;
}

.btn-registro:hover {
  background: #b7833e;
  color: #ffffff;
}

/* FOTOGRAFIA DERECHA */
.login-imagen {
  position: relative;
  min-height: 760px;
  overflow: hidden;
  background: #49382e;
}

.login-imagen img {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  object-fit: cover;
  object-position: center;
}

.imagen-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    0deg,
    rgba(45, 31, 22, 0.65),
    rgba(45, 31, 22, 0.03) 65%
  );
}

.imagen-frase {
  position: absolute;
  bottom: 65px;
  left: 55px;
  right: 55px;
  color: #ffffff;
}

.imagen-frase span {
  color: #e7c18c;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 4px;
}

.imagen-frase h2 {
  max-width: 500px;
  margin: 14px 0;
  font-family: "Cormorant Garamond", serif;
  font-size: 47px;
  font-weight: 600;
  line-height: 1.05;
}

.frase-linea {
  width: 65px;
  height: 2px;
  background: #d9b98d;
  margin: 18px 0;
}

.imagen-frase p {
  color: #f5eadd;
  font-size: 14px;
}

/* DECORACIONES */
.decoracion {
  position: absolute;
  width: 160px;
  height: 160px;
  opacity: 0.13;
  pointer-events: none;
  border: 1px solid #b7833e;
  border-radius: 50%;
}

.decoracion-superior {
  top: -100px;
  left: -100px;
}

.decoracion-inferior {
  bottom: -110px;
  right: -90px;
}

/* PIE DE PAGINA */
.login-footer {
  padding: 18px 10px 0;
  color: #927c69;
  font-size: 10px;
  letter-spacing: 2px;
  text-align: center;
}

/* TABLETS */
@media (max-width: 1000px) {
  .login-contenedor {
    grid-template-columns: 52% 48%;
  }

  .login-panel {
    padding: 35px;
  }

  .bienvenida h1 {
    font-size: 51px;
  }

  .marca {
    margin-bottom: 38px;
  }

  .imagen-frase {
    left: 30px;
    right: 30px;
  }

  .imagen-frase h2 {
    font-size: 37px;
  }
}

/* CELULARES */
@media (max-width: 700px) {
  .login-pagina {
    padding: 12px;
  }

  .login-contenedor {
    display: flex;
    flex-direction: column;
  }

  .login-panel {
    order: 2;
    padding: 40px 25px;
  }

  .login-imagen {
    order: 1;
    min-height: 260px;
    height: 260px;
  }

  .imagen-frase {
    bottom: 25px;
    left: 25px;
    right: 25px;
  }

  .imagen-frase h2 {
    font-size: 31px;
  }

  .imagen-frase p {
    font-size: 12px;
  }

  .marca {
    margin-bottom: 35px;
  }

  .marca-simbolo {
    width: 55px;
    height: 55px;
    font-size: 38px;
  }

  .marca h2 {
    font-size: 25px;
  }

  .bienvenida h1 {
    font-size: 49px;
  }

  .registro-seccion {
    margin-top: 30px;
  }

  .login-footer {
    font-size: 9px;
  }
}

/* PANTALLAS PEQUENAS */
@media (max-width: 380px) {
  .login-panel {
    padding: 35px 18px;
  }

  .bienvenida h1 {
    font-size: 42px;
  }

  .marca h2 {
    font-size: 22px;
    letter-spacing: 3px;
  }

  .marca-subtitulo {
    font-size: 8px;
    letter-spacing: 2px;
  }
}

/* LOGIN EN TAMANO COMPACTO */
@media (min-width: 701px) {
  .login-pagina {
    padding: 15px;
  }

  .login-contenedor {
    max-width: 900px;
    min-height: 540px;
    grid-template-columns: 48% 52%;
  }

  .login-panel {
    padding: 25px 35px;
  }

  .login-contenido {
    max-width: 350px;
  }

  /* Logo */
  .marca {
    margin-bottom: 22px;
  }

  .marca-simbolo {
    width: 45px;
    height: 45px;
    font-size: 32px;
  }

  .marca h2 {
    font-size: 21px;
    letter-spacing: 4px;
  }

  .marca-subtitulo {
    font-size: 8px;
  }

  /* Bienvenida */
  .bienvenida h1 {
    font-size: 42px;
  }

  .bienvenida p {
    font-size: 12px;
    line-height: 1.6;
    margin-bottom: 15px;
  }

  .linea-dorada {
    margin: 15px 0 12px;
  }

  /* Campos */
  .campo-login {
    height: 43px;
    padding: 0 12px;
  }

  .campo-login input {
    font-size: 12px;
  }

  .formulario-login {
    gap: 10px;
  }

  /* Boton */
  .btn-iniciar {
    min-height: 45px;
    font-size: 11px;
  }

  /* Registro */
  .registro-seccion {
    margin-top: 18px;
  }

  .registro-seccion p {
    font-size: 12px;
    margin-bottom: 10px;
  }

  .btn-registro {
    min-height: 38px;
    font-size: 10px;
  }

  /* Imagen */
  .login-imagen {
    min-height: 540px;
  }

  .imagen-frase {
    left: 30px;
    right: 30px;
    bottom: 35px;
  }

  .imagen-frase h2 {
    font-size: 34px;
  }

  .imagen-frase p {
    font-size: 12px;
  }
}
</style>
