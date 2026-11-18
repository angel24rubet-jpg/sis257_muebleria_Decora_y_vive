import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

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
  const productos = ref<ProductoCarrito[]>(
    JSON.parse(localStorage.getItem("carrito") || "[]"),
  );

  const total = computed(() =>
    productos.value.reduce((suma, p) => suma + p.precio * p.cantidad, 0),
  );

  const cantidadProductos = computed(() =>
    productos.value.reduce((suma, p) => suma + p.cantidad, 0),
  );

  watch(
    productos,
    (nuevosProductos) => {
      localStorage.setItem("carrito", JSON.stringify(nuevosProductos));
    },
    { deep: true },
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

  function disminuir(id_producto_color: number) {
    const producto = productos.value.find(
      (p) => p.id_producto_color === id_producto_color,
    );

    if (!producto) return;

    if (producto.cantidad > 1) {
      producto.cantidad--;
    } else {
      quitar(id_producto_color);
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
    disminuir,
    quitar,
    vaciar,
  };
});
