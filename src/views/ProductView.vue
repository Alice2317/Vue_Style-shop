<script setup>
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { toast } from '@/assets/js/swal.js'

import FooterComponent from '@/components/FooterComponent.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import autoplaySwiper from '@/components/autoplaySwiper.vue'

import cartStore from '@/stores/cartStore.js'
import loadingStore from '@/stores/loadingStore.js'
import { storeToRefs } from 'pinia'

const store = loadingStore()
const { isLoading } = storeToRefs(store)

const route = useRoute()
const router = useRouter()

// 得到購物車
const importCartStore = cartStore()
const { getCarts } = importCartStore

// 得到商品
const product = ref(null)
const category = ref(null)
function getProduct () {
  isLoading.value = true
  const api = `${import.meta.env.VITE_MAIN_URL}/v2/api/${
    import.meta.env.VITE_MAIN_NAME
  }/product/${route.params.productId}`

  axios
    .get(api)
    .then((res) => {
      if (res.data.success) {
        product.value = res.data.product
        const array = product.value.category.split(',')
        const Chinese = array.filter((item) => item.match(/[\u4e00-\u9fa5]/))
        category.value = Chinese[0]
      }

      isLoading.value = false
    })
    .catch((error) => {
      toast(false, '失敗，請重新操作')
      console.error('productView-getProduct出錯', error)
      isLoading.value = false
    })
}

onMounted(() => {
  getProduct()
})

// 調整數量
const num = ref(1)
function updateCount (state) {
  if (state) {
    if (!(num.value >= 10)) {
      num.value++
    }
  } else {
    if (!(num.value <= 1)) {
      num.value--
    }
  }
}

// 加入購物車
function postCart (val) {
  isLoading.value = true
  const api = `${import.meta.env.VITE_MAIN_URL}/v2/api/${
    import.meta.env.VITE_MAIN_NAME
  }/cart`

  axios
    .post(api, {
      data: { product_id: route.params.productId, qty: val.number }
    })
    .then((res) => {
      if (res.data.success) {
        toast(true, '成功加入購物車')
        getCarts()
      } else {
        toast(false, '失敗，請重新操作')
      }

      isLoading.value = false
    })
    .catch((error) => {
      toast(false, '失敗，請重新操作')
      console.error('productView-postCart出錯', error)
      isLoading.value = false
    })
}

// 監測路由
router.afterEach((to, from) => {
  if (to.fullPath !== from.fullPath) {
    getProduct()
    num.value = 1
  }
  window.scrollTo(0, 0)
})
</script>

<template>
  <HeaderComponent />
  <main class="container">
    <div class="row align-items-center">
      <div class="col-md-6">
        <img :src="product?.imageUrl" class="img-fluid" :alt="product?.id" />
      </div>
      <div class="col-md-6">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb bg-white px-0 mb-0 py-3">
            <li class="breadcrumb-item">
              <router-link class="text-muted" to="/">回首頁</router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link class="text-muted" :to="{ name: 'products' }"
                >全部</router-link
              >
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {{ category }}
            </li>
          </ol>
        </nav>
        <h2 class="fw-bold h1 mb-1">{{ product?.title }}</h2>
        <p v-html="product?.description"></p>
        <p class="pb-6" v-html="product?.content"></p>
        <p class="mb-0 text-muted text-end">
          <del>NT ${{ product?.origin_price }}</del>
        </p>
        <p class="h4 fw-bold text-end">NT ${{ product?.price }}</p>
        <VForm v-slot="{ errors }" @submit="postCart">
          <div class="row align-items-center">
            <div class="col-6">
              <div class="input-group my-3 bg-light rounded">
                <div class="input-group-prepend">
                  <button
                    class="btn btn-outline-dark border-0 py-2"
                    type="button"
                    id="button-addon1"
                    @click="updateCount(false)"
                  >
                    <i class="fas fa-minus"></i>
                  </button>
                </div>
                <VField
                  name="number"
                  type="text"
                  :class="{ 'is-invalid': errors['number'] }"
                  class="form-control border-0 text-center my-auto shadow-none bg-light"
                  rules="required|integer|between:1,10"
                  v-model="num"
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-dark border-0 py-2"
                    type="button"
                    id="button-addon2"
                    @click="updateCount(true)"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="col-6">
              <button type="submit" class="text-nowrap btn btn-dark w-100 py-2">
                加入購物車
              </button>
            </div>
          </div>
        </VForm>
      </div>
    </div>
    <div class="my-5">
      <autoplaySwiper />
    </div>
  </main>
  <FooterComponent />
</template>
