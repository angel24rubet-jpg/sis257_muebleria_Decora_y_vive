<script setup lang="ts">
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

const formulario = ref({
  nombres: "",
  apellidos: "",
  ci: "",
  telefono: "",
  usuario: "",
  correo: "",
  password: "",
});

const error = ref("");
const cargando = ref(false);
const mostrarPassword = ref(false);

// Registrar usuario
async function registrar() {
  error.value = "";
  cargando.value = true;

  try {
    const nombreCompleto = `${formulario.value.nombres.trim()} ${formulario.value.apellidos.trim()}`;

    await auth.registrar({
      ...formulario.value,
      nombre_completo: nombreCompleto,
    });

    router.push("/tienda");
  } catch (e: any) {
    error.value = e.response?.data?.message || "No se pudo crear la cuenta";
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <main class="registro-pagina">
    <section class="registro-contenedor">
      <!-- PANEL IZQUIERDO: FORMULARIO -->
      <div class="registro-panel">
        <div class="registro-contenido">
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
              Crea tu
              <span>cuenta</span>
            </h1>

            <div class="linea-dorada"></div>

            <p>
              Únete a Decora y Vive y descubre muebles diseñados para
              transformar tu hogar.
            </p>
          </div>

          <!-- FORMULARIO -->
          <form @submit.prevent="registrar" class="formulario-registro">
            <div class="campos-grid">
              <!-- Nombres -->
              <div class="campo-registro">
                <i class="pi pi-user"></i>
                <input
                  v-model="formulario.nombres"
                  type="text"
                  placeholder="Nombres"
                  maxlength="100"
                  autocomplete="given-name"
                  required
                />
              </div>

              <!-- Apellidos -->
              <div class="campo-registro">
                <i class="pi pi-user"></i>
                <input
                  v-model="formulario.apellidos"
                  type="text"
                  placeholder="Apellidos"
                  maxlength="100"
                  autocomplete="family-name"
                  required
                />
              </div>

              <!-- CI -->
              <div class="campo-registro">
                <i class="pi pi-id-card"></i>
                <input
                  v-model="formulario.ci"
                  type="text"
                  placeholder="Carnet de identidad"
                  maxlength="20"
                  required
                />
              </div>

              <!-- Telefono -->
              <div class="campo-registro">
                <i class="pi pi-phone"></i>
                <input
                  v-model="formulario.telefono"
                  type="tel"
                  placeholder="Número de teléfono"
                  maxlength="20"
                  autocomplete="tel"
                  required
                />
              </div>

              <!-- Usuario -->
              <div class="campo-registro">
                <i class="pi pi-at"></i>
                <input
                  v-model="formulario.usuario"
                  type="text"
                  placeholder="Nombre de usuario"
                  maxlength="50"
                  autocomplete="username"
                  required
                />
              </div>

              <!-- Correo -->
              <div class="campo-registro">
                <i class="pi pi-envelope"></i>
                <input
                  v-model="formulario.correo"
                  type="email"
                  placeholder="Correo electrónico"
                  maxlength="120"
                  autocomplete="email"
                  required
                />
              </div>

              <!-- Contraseña -->
              <div class="campo-registro campo-password">
                <i class="pi pi-lock"></i>

                <input
                  v-model="formulario.password"
                  :type="mostrarPassword ? 'text' : 'password'"
                  placeholder="Contraseña (mínimo 8 caracteres)"
                  minlength="8"
                  autocomplete="new-password"
                  required
                />

                <button
                  type="button"
                  class="btn-mostrar-password"
                  @click="mostrarPassword = !mostrarPassword"
                  :aria-label="
                    mostrarPassword
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  "
                >
                  <i
                    :class="mostrarPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                  ></i>
                </button>
              </div>
            </div>

            <!-- ERROR -->
            <p v-if="error" class="mensaje-error">
              <i class="pi pi-exclamation-circle"></i>
              {{ error }}
            </p>

            <!-- CREAR CUENTA -->
            <button type="submit" class="btn-crear" :disabled="cargando">
              {{ cargando ? "REGISTRANDO..." : "CREAR MI CUENTA" }}
              <i v-if="!cargando" class="pi pi-arrow-right"></i>
            </button>
          </form>

          <!-- VOLVER AL LOGIN -->
          <div class="login-enlace">
            <span>¿Ya tienes una cuenta?</span>
            <RouterLink to="/login">Iniciar sesión</RouterLink>
          </div>
        </div>
      </div>

      <!-- PANEL DERECHO: FOTOGRAFIA -->
      <div class="registro-imagen">
        <img
          src="/images/login-bg.jpg"
          alt="Ambiente elegante de Decora y Vive"
        />

        <div class="imagen-overlay"></div>

        <div class="imagen-frase">
          <span>UN HOGAR CON TU ESENCIA</span>

          <h2>Cada espacio cuenta una historia.</h2>

          <div class="frase-linea"></div>

          <p>Encuentra inspiración para crear el hogar que siempre soñaste.</p>
        </div>
      </div>
    </section>

    <footer class="registro-footer">
      © 2026 DECORA Y VIVE · MUEBLES & DECORACIÓN
    </footer>
  </main>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap");

/* PAGINA PRINCIPAL */
.registro-pagina {
  min-height: 100vh;
  padding: 15px;
  background: #f6f1e9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Montserrat", sans-serif;
}

/* CONTENEDOR */
.registro-contenedor {
  width: 100%;
  max-width: 950px;
  min-height: 620px;
  display: grid;
  grid-template-columns: 58% 42%;
  background: #fffaf4;
  overflow: hidden;
  box-shadow: 0 15px 45px rgba(73, 56, 46, 0.13);
}

/* PANEL DEL FORMULARIO */
.registro-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px 38px;
  background: #fffaf4;
}

.registro-contenido {
  width: 100%;
  max-width: 490px;
}

/* MARCA */
.marca {
  text-align: center;
  margin-bottom: 22px;
}

.marca-simbolo {
  width: 45px;
  height: 45px;
  margin: 0 auto 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #a77b42;
  color: #a77b42;
  font-family: "Cormorant Garamond", serif;
  font-size: 32px;
  line-height: 1;
}

.marca h2 {
  color: #49382e;
  font-family: "Cormorant Garamond", serif;
  font-size: 23px;
  font-weight: 600;
  letter-spacing: 4px;
  margin: 0;
}

.marca-subtitulo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 5px;
  color: #72543a;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 2px;
}

.marca-subtitulo span {
  width: 28px;
  height: 1px;
  background: #c89b5c;
}

/* BIENVENIDA */
.bienvenida h1 {
  color: #49382e;
  font-family: "Cormorant Garamond", serif;
  font-size: 45px;
  font-weight: 600;
  line-height: 0.95;
  margin: 0;
}

.bienvenida h1 span {
  color: #b7833e;
  font-style: italic;
}

.linea-dorada {
  width: 70px;
  height: 3px;
  margin: 13px 0 10px;
  background: #b7833e;
}

.bienvenida p {
  color: #6b5748;
  font-size: 12px;
  line-height: 1.7;
  margin: 0 0 17px;
}

/* FORMULARIO */
.formulario-registro {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.campos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 11px;
}

/* CAMPOS */
.campo-registro {
  height: 43px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 11px;
  border: 1px solid #d7c5b3;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.45);
  transition: all 0.25s ease;
  min-width: 0;
}

.campo-registro:focus-within {
  border-color: #b7833e;
  box-shadow: 0 0 0 3px rgba(183, 131, 62, 0.1);
}

.campo-registro > i {
  color: #76583e;
  font-size: 16px;
  flex-shrink: 0;
}

.campo-registro input {
  width: 100%;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #49382e;
  font-family: "Montserrat", sans-serif;
  font-size: 11px;
}

.campo-registro input::placeholder {
  color: #8c8077;
}

/* CONTRASEÑA */
.campo-password {
  grid-column: 1 / -1;
}

.btn-mostrar-password {
  border: none;
  background: transparent;
  color: #76583e;
  cursor: pointer;
  font-size: 15px;
  padding: 4px;
  flex-shrink: 0;
}

/* ERROR */
.mensaje-error {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b23b32;
  font-size: 11px;
  margin: 0;
}

/* BOTON CREAR */
.btn-crear {
  width: 100%;
  min-height: 47px;
  margin-top: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: #543522;
  color: #ffffff;
  border: 1px solid #543522;
  border-radius: 5px;
  font-family: "Montserrat", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-crear:hover:not(:disabled) {
  background: #a7793e;
  border-color: #a7793e;
}

.btn-crear:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* ENLACE AL LOGIN */
.login-enlace {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 11px;
  color: #634a38;
}

.login-enlace a {
  color: #a7793e;
  font-weight: 700;
  text-decoration: none;
}

.login-enlace a:hover {
  text-decoration: underline;
}

/* PANEL DE FOTOGRAFIA */
.registro-imagen {
  position: relative;
  min-height: 620px;
  overflow: hidden;
  background: #49382e;
}

.registro-imagen img {
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
    rgba(45, 31, 22, 0.68),
    rgba(45, 31, 22, 0.02) 70%
  );
}

.imagen-frase {
  position: absolute;
  bottom: 45px;
  left: 30px;
  right: 30px;
  color: #ffffff;
}

.imagen-frase span {
  color: #e7c18c;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 3px;
}

.imagen-frase h2 {
  max-width: 350px;
  margin: 12px 0;
  font-family: "Cormorant Garamond", serif;
  font-size: 37px;
  font-weight: 600;
  line-height: 1.05;
}

.frase-linea {
  width: 55px;
  height: 2px;
  background: #d9b98d;
  margin: 15px 0;
}

.imagen-frase p {
  color: #f5eadd;
  font-size: 11px;
  line-height: 1.6;
}

/* PIE DE PAGINA */
.registro-footer {
  padding: 13px 10px 0;
  color: #927c69;
  font-size: 9px;
  letter-spacing: 2px;
  text-align: center;
}

/* TABLETS */
@media (max-width: 900px) and (min-width: 701px) {
  .registro-contenedor {
    grid-template-columns: 62% 38%;
  }

  .registro-panel {
    padding: 25px;
  }

  .campos-grid {
    grid-template-columns: 1fr;
  }

  .registro-imagen {
    min-height: 700px;
  }
}

/* CELULARES */
@media (max-width: 700px) {
  .registro-pagina {
    padding: 12px;
  }

  .registro-contenedor {
    display: flex;
    flex-direction: column;
  }

  .registro-imagen {
    order: 1;
    min-height: 230px;
    height: 230px;
  }

  .registro-panel {
    order: 2;
    padding: 35px 22px;
  }

  .imagen-frase {
    bottom: 20px;
    left: 22px;
    right: 22px;
  }

  .imagen-frase h2 {
    font-size: 30px;
  }

  .marca {
    margin-bottom: 28px;
  }

  .bienvenida h1 {
    font-size: 43px;
  }

  .campos-grid {
    grid-template-columns: 1fr;
  }

  .campo-password {
    grid-column: auto;
  }

  .campo-registro {
    height: 47px;
  }

  .campo-registro input {
    font-size: 12px;
  }

  .login-enlace {
    margin-top: 22px;
  }
}

/* PANTALLAS PEQUENAS */
@media (max-width: 380px) {
  .registro-panel {
    padding: 30px 16px;
  }

  .marca h2 {
    font-size: 21px;
    letter-spacing: 3px;
  }

  .bienvenida h1 {
    font-size: 39px;
  }
}
</style>
