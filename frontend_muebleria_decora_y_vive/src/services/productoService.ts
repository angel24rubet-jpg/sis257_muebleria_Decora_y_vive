import api from "./api";

// Listar todos los productos
export const listarProductos = async () => {
  const respuesta = await api.get("/productos");
  return respuesta.data;
};

// Buscar un producto por ID
export const buscarProducto = async (id: number) => {
  const respuesta = await api.get(`/productos/${id}`);
  return respuesta.data;
};

// Registrar un producto
export const registrarProducto = async (datos: object) => {
  const respuesta = await api.post("/productos", datos);
  return respuesta.data;
};

// Modificar un producto
export const modificarProducto = async (id: number, datos: object) => {
  const respuesta = await api.patch(`/productos/${id}`, datos);
  return respuesta.data;
};

// Eliminar un producto de manera lógica
export const eliminarProducto = async (id: number) => {
  const respuesta = await api.delete(`/productos/${id}`);
  return respuesta.data;
};
