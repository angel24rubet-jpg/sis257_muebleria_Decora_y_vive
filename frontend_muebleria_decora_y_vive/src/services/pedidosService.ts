import api from "./api";

export const listarPedidos = async () => {
  const respuesta = await api.get("/pedidos");
  return respuesta.data;
};

export const buscarPedido = async (id: number) => {
  const respuesta = await api.get(`/pedidos/${id}`);
  return respuesta.data;
};

export const verificarPago = async (
  id: number,
  datos: {
    estado_pago: "PAGADO" | "RECHAZADO";
    observacion?: string;
  },
) => {
  const respuesta = await api.patch(`/pedidos/pagos/${id}/verificar`, datos);
  return respuesta.data;
};

export const actualizarEstadoPedido = async (
  id: number,
  estado_pedido: string,
) => {
  const respuesta = await api.patch(`/pedidos/${id}/estado`, {
    estado_pedido,
  });
  return respuesta.data;
};
