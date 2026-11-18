import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface ProductoCarrito {
  id_producto_color: number;
  id_producto: number;
  nombre: string;
  fotografia: string;
  precio: number;
  color: string;
  cantidad: number;
  stock: number;
}

export const useCarritoStore = defineStore("carrito", () => {
  const productos = ref<ProductoCarrito[]>([]);

  const total = computed(() =>
    productos.value.reduce(
      (suma, producto) => suma + producto.precio * producto.cantidad,
      0,
    ),
  );

  const cantidadProductos = computed(() =>
    productos.value.reduce((suma, producto) => suma + producto.cantidad, 0),
  );

  function agregar(producto: ProductoCarrito) {
    const existente = productos.value.find(
      (p) => p.id_producto_color === producto.id_producto_color,
    );

    if (existente) {
      if (existente.cantidad < existente.stock) {
        existente.cantidad++;
      }
      return;
    }

    if (producto.stock > 0) {
      productos.value.push({ ...producto, cantidad: 1 });
    }
  }

  function quitar(id_producto_color: number) {
    productos.value = productos.value.filter(
      (p) => p.id_producto_color !== id_producto_color,
    );
  }

  function vaciar() {
    productos.value = [];
  }

  return {
    productos,
    total,
    cantidadProductos,
    agregar,
    quitar,
    vaciar,
  };
});
