<script setup lang="ts">
import { ref } from "vue";
import { useCarritoStore } from "@/stores/carrito";

const carrito = useCarritoStore();
// Aquí el compañero conectará la lógica para cargar un producto por ID (ej. usando const route = useRoute())
</script>

<template>
  <div>
    <!-- Single Page Header start -->
    <div class="container-fluid page-header py-5">
        <h1 class="text-center text-white display-6 wow fadeInUp" data-wow-delay="0.1s">Single Product</h1>
        <ol class="breadcrumb justify-content-center mb-0 wow fadeInUp" data-wow-delay="0.3s">
            <li class="breadcrumb-item"><RouterLink to="/">Home</RouterLink></li>
            <li class="breadcrumb-item"><a href="#">Pages</a></li>
            <li class="breadcrumb-item active text-white">Single Product</li>
        </ol>
    </div>
    <!-- Single Page Header End -->

    <!-- Single Products Start -->
    <div class="container-fluid shop py-5">
        <div class="container py-5">
            <div class="row g-4">
                <!-- Sidebar Izquierdo -->
                <div class="col-lg-5 col-xl-3 wow fadeInUp" data-wow-delay="0.1s">
                    <div class="input-group w-100 mx-auto d-flex mb-4">
                        <input type="search" class="form-control p-3" placeholder="keywords"
                            aria-describedby="search-icon-1">
                        <span id="search-icon-1" class="input-group-text p-3"><i class="fa fa-search"></i></span>
                    </div>
                    <div class="product-categories mb-4">
                        <h4>Products Categories</h4>
                        <ul class="list-unstyled">
                            <li>
                                <div class="categories-item">
                                    <a href="#" class="text-dark"><i class="fas fa-apple-alt text-secondary me-2"></i> Accesorios</a>
                                    <span>(3)</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="additional-product mb-4">
                        <h4>Select By Color</h4>
                        <div class="additional-product-item">
                            <input type="radio" class="me-2" id="Categories-1" name="Categories-1" value="Gold">
                            <label for="Categories-1" class="text-dark"> Gold</label>
                        </div>
                    </div>
                </div>

                <!-- Contenido Principal del Producto -->
                <div class="col-lg-7 col-xl-9 wow fadeInUp" data-wow-delay="0.1s">
                    <div class="row g-4 single-product">
                        <div class="col-xl-6">
                            <div class="single-inner bg-light rounded">
                                <!-- Imagen Principal (Conectada a la base por tu compañero) -->
                                <img src="/img/product-4.png" class="img-fluid rounded w-100" alt="Image">
                            </div>
                        </div>
                        <div class="col-xl-6">
                            <h4 class="fw-bold mb-3">Mueble de Ejemplo</h4>
                            <p class="mb-3">Category: Salas</p>
                            <h5 class="fw-bold mb-3">Bs 1200.00</h5>
                            <div class="d-flex mb-4">
                                <i class="fa fa-star text-secondary"></i>
                                <i class="fa fa-star text-secondary"></i>
                                <i class="fa fa-star text-secondary"></i>
                                <i class="fa fa-star text-secondary"></i>
                                <i class="fa fa-star"></i>
                            </div>
                            <div class="mb-3">
                                <div class="btn btn-primary d-inline-block rounded text-white py-1 px-4 me-2"><i class="fab fa-facebook-f me-1"></i> Share</div>
                                <div class="btn btn-secondary d-inline-block rounded text-white py-1 px-4 ms-2"><i class="fab fa-twitter ms-1"></i> Share</div>
                            </div>
                            <div class="d-flex flex-column mb-3">
                                <small>Available: <strong class="text-primary">20 items in stock</strong></small>
                            </div>
                            <p class="mb-4">Descripción dinámica del mueble extraída de la base de datos decora_y_vive. Excelente calidad y confort garantizado.</p>
                            
                            <!-- Control de Cantidad -->
                            <div class="input-group quantity mb-5" style="width: 100px;">
                                <div class="input-group-btn">
                                    <button class="btn btn-sm btn-minus rounded-circle bg-light border"><i class="fa fa-minus"></i></button>
                                </div>
                                <input type="text" class="form-control form-control-sm text-center border-0" value="1">
                                <div class="input-group-btn">
                                    <button class="btn btn-sm btn-plus rounded-circle bg-light border"><i class="fa fa-plus"></i></button>
                                </div>
                            </div>
                            <a href="#" class="btn btn-primary border border-secondary rounded-pill px-4 py-2 mb-4 text-primary">
                                <i class="fa fa-shopping-bag me-2 text-white"></i> Add to cart
                            </a>
                        </div>

                        <!-- Pestañas de Descripción y Reseñas -->
                        <div class="col-lg-12">
                            <nav>
                                <div class="nav nav-tabs mb-3">
                                    <button class="nav-link active border-white border-bottom-0" type="button"
                                        role="tab" id="nav-about-tab" data-bs-toggle="tab" data-bs-target="#nav-about"
                                        aria-controls="nav-about" aria-selected="true">Description</button>
                                    <button class="nav-link border-white border-bottom-0" type="button" role="tab"
                                        id="nav-mission-tab" data-bs-toggle="tab" data-bs-target="#nav-mission"
                                        aria-controls="nav-mission" aria-selected="false">Reviews</button>
                                </div>
                            </nav>
                            <div class="tab-content mb-5">
                                <div class="tab-pane active" id="nav-about" role="tabpanel" aria-labelledby="nav-about-tab">
                                    <p>Aquí irá el texto largo descriptivo del producto que tu compañero jalará de la base de datos.</p>
                                </div>
                                <div class="tab-pane" id="nav-mission" role="tabpanel" aria-labelledby="nav-mission-tab">
                                    <div class="d-flex">
                                        <img src="/img/avatar.jpg" class="img-fluid rounded-circle p-3" style="width: 100px; height: 100px;" alt="">
                                        <div class="">
                                            <p class="mb-2" style="font-size: 14px;">April 12, 2026</p>
                                            <div class="d-flex justify-content-between">
                                                <h5>Usuario Cliente</h5>
                                            </div>
                                            <p>Excelente mueble para mi sala.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Single Products End -->
  </div>
</template>