<script setup>
import axios from 'axios'
import { ref, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { Autoplay } from 'swiper/modules'

// swiper
defineComponent(Swiper)
defineComponent(SwiperSlide)
const modules = ref(Autoplay)

// 推薦商品
const otherProducts = ref(null)
const route = useRoute()
async function getOtherProducts () {
  const api = `${import.meta.env.VITE_MAIN_URL}/v2/api/${
    import.meta.env.VITE_MAIN_NAME
  }/products/all`
  await axios.get(api).then((res) => {
    if (res.data.success) {
      otherProducts.value = res.data.products.filter((item) =>
        item.category.match('新品')
      )
    }
  }).catch((error) => {
    console.error('autoplaySwiper-getOtherProducts出錯', error)
  })

  if (route.params.productId !== undefined) {
    const findIndex = otherProducts.value.findIndex(
      (item) => item.id === route.params.productId
    )
    otherProducts.value.splice(findIndex, 1)
  }
}

getOtherProducts()

const router = useRouter()
router.afterEach((to, from) => {
  if (to.fullPath !== from.fullPath) {
    getOtherProducts()
  }
})
</script>

<template>
  <h3 class="fw-bold">推薦商品</h3>
  <swiper
    :autoplay="{ delay: 3000, disableOnInteraction: false }"
    :slidesPerView="2"
    :spaceBetween="10"
    :breakpoints="{
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      990: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
    }"
    :modules="[modules]"
  >
    <swiper-slide v-for="item in otherProducts" :key="item.id">
      <div class="card border-0 mb-4 position-relative">
        <router-link :to="{ name: 'product', params: { productId: item.id } }">
          <img
            :src="item.imageUrl"
            class="card-img-top rounded-0 cursor-pointer"
            :alt="item.id"
          />
        </router-link>
        <div class="card-body cursor-pointer p-0 px-3">
          <router-link
            class="text-decoration-none"
            :to="{ name: 'product', params: { productId: item.id } }"
          >
            <h4 class="mb-0 mt-3">{{ item.title }}</h4>
            <span class="card-text fs-5 text-danger">NT$ {{ item.price }}</span>
            <span class="text-muted ms-2"
              ><del>NT$ {{ item.origin_price }}</del></span
            >
          </router-link>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>
