<script setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

import cartStore from '@/stores/cartStore'

const store = cartStore()
const { cartsLength } = storeToRefs(store)
const { getCarts } = store
onMounted(() => getCarts())
</script>

<template>
  <div class="container">
    <nav class="navbar navbar-expand-lg px-0">
      <router-link class="navbar-brand ff-serif text-uppercase" to="/"
        >style</router-link
      >
      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="navbar-dropdown position-lg-static position-absolute start-0 end-0 flex-lg-grow-1"
      >
        <div
          class="collapse navbar-collapse justify-content-lg-end"
          id="navbarNavAltMarkup"
        >
          <div class="navbar-nav">
            <router-link
              class="nav-item nav-link me-4 ff-serif text-capitalize fw-bold"
              :to="{ name: 'products' }"
              >產品</router-link
            >

            <router-link class="nav-item nav-link" :to="{ name: 'cart' }">
              <i class="fas fa-shopping-cart position-relative">
                <span
                  class="position-absolute top-100 start-100 translate-middle badge rounded-pill bg-danger"
                >
                  {{ cartsLength }}
                  <span class="visually-hidden">unread messages</span>
                </span>
              </i>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
