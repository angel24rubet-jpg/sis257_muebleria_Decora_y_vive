import api from "@/services/api";

export const generarReporteVentas = async (
  fecha_inicio: string,
  fecha_fin: string,
) => {
  const { data } = await api.get("/reportes/ventas", {
    params: {
      fecha_inicio,
      fecha_fin,
    },
  });

  return data;
};
