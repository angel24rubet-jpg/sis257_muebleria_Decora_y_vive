import api from "@/services/api";

export const listarClientes = async () => {
  const { data } = await api.get("/clientes");
  return data;
};

export const buscarCliente = async (id: number) => {
  const { data } = await api.get(`/clientes/${id}`);
  return data;
};

export const registrarCliente = async (cliente: any) => {
  const { data } = await api.post("/clientes", cliente);
  return data;
};

export const modificarCliente = async (id: number, cliente: any) => {
  const { data } = await api.patch(`/clientes/${id}`, cliente);
  return data;
};

export const eliminarCliente = async (id: number) => {
  const { data } = await api.delete(`/clientes/${id}`);
  return data;
};
