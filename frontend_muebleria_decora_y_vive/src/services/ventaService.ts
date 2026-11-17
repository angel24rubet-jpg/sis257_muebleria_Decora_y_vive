import api from "@/services/api";

// Listar ventas
export const listarVentas = async () => {
  const { data } = await api.get("/ventas");
  return data;
};

// Buscar venta por ID
export const buscarVenta = async (id: number) => {
  const { data } = await api.get(`/ventas/${id}`);
  return data;
};

// Registrar venta
export const registrarVenta = async (venta: any) => {
  const { data } = await api.post("/ventas", venta);
  return data;
};

// Modificar estado de venta
export const modificarVenta = async (id: number, venta: any) => {
  const { data } = await api.patch(`/ventas/${id}`, venta);
  return data;
};

// Anular venta
export const anularVenta = async (id: number) => {
  const { data } = await api.delete(`/ventas/${id}`);
  return data;
};
