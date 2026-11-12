import api from "./api";

// Listar todos los colores
export const listarColores = async () => {
  const respuesta = await api.get("/colores");
  return respuesta.data;
};

// Registrar un color
export const registrarColor = async (datos: object) => {
  const respuesta = await api.post("/colores", datos);
  return respuesta.data;
};

// Buscar un color por ID
export const buscarColor = async (id: number) => {
  const respuesta = await api.get(`/colores/${id}`);
  return respuesta.data;
};

// Modificar un color
export const modificarColor = async (id: number, datos: object) => {
  const respuesta = await api.patch(`/colores/${id}`, datos);
  return respuesta.data;
};

// Eliminar un color
export const eliminarColor = async (id: number) => {
  const respuesta = await api.delete(`/colores/${id}`);
  return respuesta.data;
};
