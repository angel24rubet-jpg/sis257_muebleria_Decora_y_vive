<script setup lang="ts">
import { ref, onMounted } from "vue";
import { listarProductos } from "@/services/productoService";

const productos = ref<any[]>([]);

onMounted(async () => {
  try {
    productos.value = await listarProductos();
  } catch (error) {
    console.error("Error al cargar productos bestsellers");
  }
});
</script>

<template>
  <div>
    <!-- Single Page Header start -->
    <div class="container-fluid page-header py-5">
        <h1 class="text-center text-white display-6 wow fadeInUp" data-wow-delay="0.1s">Bestseller Products</h1>
        <ol class="breadcrumb justify-content-center mb-0 wow fadeInUp" data-wow-delay="0.3s">
            <li class="breadcrumb-item"><RouterLink to="/">Home</RouterLink></li>
            <li class="breadcrumb-item"><a href="#">Pages</a></li>
            <li class="breadcrumb-item active text-white">Bestseller</li>
        </ol>
    </div>
    <!-- Single Page Header End -->

    <!-- Searvices Start -->
    <div class="container-fluid px-0">
        <div class="row g-0">
            <div class="col-6 col-md-4 col-lg-2 border-start border-end wow fadeInUp" data-wow-delay="0.1s">
                <div class="p-4">
                    <div class="d-inline-flex align-items-center">
                        <i class="fa fa-sync-alt fa-2x text-primary"></i>
                        <div class="ms-4">
                            <h6 class="text-uppercase mb-2">Free Return</h6>
                            <p class="mb-0">30 days money back guarantee!</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ... los servicios continúan con la estructura original ... -->
        </div>
    </div>
    <!-- Searvices End -->

    <!-- Bestseller Products Start -->
    <div class="container-fluid products pt-5 pb-5">
        <div class="container products-mini py-5">
            <div class="mx-auto text-center mb-5" style="max-width: 700px;">
                <h4 class="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius wow fadeInUp" data-wow-delay="0.1s">Bestseller Products</h4>
                <p class="mb-0 wow fadeInUp" data-wow-delay="0.2s">Los muebles favoritos de nuestros clientes.</p>
            </div>
            <div class="row g-4">
                
                <!-- Tarjeta Original iterada con v-for -->
                <div class="col-md-6 col-lg-6 col-xl-4 wow fadeInUp" data-wow-delay="0.1s" v-for="producto in productos" :key="producto.id_producto">
                    <div class="products-mini-item border">
                        <div class="row g-0">
                            <div class="col-5">
                                <div class="products-mini-img border-end h-100">
                                    <img :src="producto.fotografia || '/img/product-3.png'" class="img-fluid w-100 h-100" style="object-fit:cover;" alt="Image">
                                    <div class="products-mini-icon rounded-circle bg-primary">
                                        <a href="#"><i class="fa fa-eye fa-1x text-white"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-7">
                                <div class="products-mini-content p-3">
                                    <a href="#" class="d-block mb-2">Mueble</a>
                                    <a href="#" class="d-block h4">{{ producto.nombre }}</a>
                                    <span class="text-primary fs-5">Bs {{ Number(producto.precio).toFixed(2) }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="products-mini-add border p-3">
                            <a href="#" class="btn btn-primary border-secondary rounded-pill py-2 px-4"><i class="fas fa-shopping-cart me-2"></i> Add To Cart</a>
                            <div class="d-flex">
                                <a href="#" class="text-primary d-flex align-items-center justify-content-center me-3"><span class="rounded-circle btn-sm-square border"><i class="fas fa-random"></i></span></a>
                                <a href="#" class="text-primary d-flex align-items-center justify-content-center me-0"><span class="rounded-circle btn-sm-square border"><i class="fas fa-heart"></i></span></a>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Fin Tarjeta -->
                
            </div>
        </div>
    </div>
    <!-- Bestseller Products End -->
  </div>
</template>