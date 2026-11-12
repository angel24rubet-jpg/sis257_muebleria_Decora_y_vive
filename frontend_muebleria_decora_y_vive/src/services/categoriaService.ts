import api from "./api";

// Obtener todas las categorias
export const listarCategorias = async () => {
  const respuesta = await api.get("/categorias");
  return respuesta.data;
};

// Registrar una categoria
export const registrarCategoria = async (datos: object) => {
  const respuesta = await api.post("/categorias", datos);
  return respuesta.data;
};

// Buscar una categoria por su ID
export const buscarCategoria = async (id: number) => {
  const respuesta = await api.get(`/categorias/${id}`);
  return respuesta.data;
};

// Modificar una categoria
export const modificarCategoria = async (id: number, datos: object) => {
  const respuesta = await api.patch(`/categorias/${id}`, datos);
  return respuesta.data;
};

// Eliminar una categoria
export const eliminarCategoria = async (id: number) => {
  const respuesta = await api.delete(`/categorias/${id}`);
  return respuesta.data;
};
